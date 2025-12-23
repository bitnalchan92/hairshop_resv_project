import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class PublicBookingsService {
  constructor(private prisma: PrismaService) {}

  /**
   * 예약 생성
   */
  async create(tenantId: string, dto: CreateBookingDto) {
    // 1. 서비스 조회
    const service = await this.prisma.service.findFirst({
      where: {
        id: dto.serviceId,
        tenantId,
        isActive: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // 2. 예약 날짜와 시간 파싱
    const bookingDate = new Date(dto.bookingDate);
    const [hours, minutes] = dto.bookingTime.split(':').map(Number);
    const bookingTime = new Date();
    bookingTime.setHours(hours, minutes, 0, 0);

    // 3. 과거 날짜 체크
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDay = new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate());

    if (targetDay < today) {
      throw new BadRequestException('Cannot book in the past');
    }

    // 4. 휴무일 체크
    const holiday = await this.prisma.holiday.findFirst({
      where: {
        tenantId,
        holidayDate: bookingDate,
      },
    });

    if (holiday) {
      throw new BadRequestException('This date is a holiday');
    }

    // 5. 영업시간 체크
    const storeInfo = await this.prisma.storeInfo.findUnique({
      where: { tenantId },
    });

    if (!storeInfo) {
      throw new NotFoundException('Store info not found');
    }

    const dayOfWeek = this.getDayOfWeek(bookingDate);
    const openingHours = storeInfo.openingHours as any;
    const todayHours = openingHours?.[dayOfWeek];

    if (!todayHours || todayHours === '휴무') {
      throw new BadRequestException('Store is closed on this day');
    }

    // 6. 중복 예약 체크 (같은 시간대에 다른 예약이 있는지)
    const startMinutes = hours * 60 + minutes;
    const endMinutes = startMinutes + service.durationMinutes;

    const conflictingBooking = await this.prisma.booking.findFirst({
      where: {
        tenantId,
        serviceId: dto.serviceId,
        bookingDate,
        status: { in: ['pending', 'confirmed'] },
      },
    });

    if (conflictingBooking) {
      const existingTime = new Date(conflictingBooking.bookingTime);
      const existingStartMinutes = existingTime.getHours() * 60 + existingTime.getMinutes();
      const existingEndMinutes = existingStartMinutes + conflictingBooking.durationMinutes;

      // 겹치는지 확인
      const isOverlapping =
        (startMinutes >= existingStartMinutes && startMinutes < existingEndMinutes) ||
        (endMinutes > existingStartMinutes && endMinutes <= existingEndMinutes) ||
        (startMinutes <= existingStartMinutes && endMinutes >= existingEndMinutes);

      if (isOverlapping) {
        throw new ConflictException('This time slot is already booked');
      }
    }

    // 7. Customer 레코드 생성 또는 조회 (Booking 생성 전에 먼저!)
    await this.prisma.customer.upsert({
      where: {
        phone_tenantId: {
          phone: dto.customerPhone,
          tenantId,
        },
      },
      create: {
        tenantId,
        name: dto.customerName,
        phone: dto.customerPhone,
        email: dto.customerEmail,
        totalBookings: 0,
      },
      update: {
        name: dto.customerName,
        email: dto.customerEmail,
      },
    });

    // 8. 예약 생성
    const booking = await this.prisma.booking.create({
      data: {
        tenantId,
        serviceId: dto.serviceId,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        bookingDate,
        bookingTime,
        durationMinutes: service.durationMinutes,
        totalPrice: service.price,
        status: 'pending', // 결제 전 상태
        paymentStatus: 'pending',
        specialRequest: dto.specialRequest,
      },
      include: {
        service: {
          select: {
            name: true,
            price: true,
            durationMinutes: true,
          },
        },
      },
    });

    // 9. 알림 생성 (사장님에게)
    await this.prisma.notification.create({
      data: {
        tenantId,
        bookingId: booking.id,
        type: 'booking_created',
        message: `새로운 예약이 등록되었습니다. (${dto.customerName}, ${dto.bookingDate} ${dto.bookingTime})`,
        isRead: false,
      },
    });

    return {
      success: true,
      data: {
        id: booking.id,
        serviceName: booking.service.name,
        customerName: booking.customerName,
        bookingDate: booking.bookingDate,
        bookingTime: booking.bookingTime,
        totalPrice: booking.totalPrice,
        status: booking.status,
        paymentStatus: booking.paymentStatus,
        message: '예약이 생성되었습니다. 결제를 진행해주세요.',
      },
    };
  }

  /**
   * 예약 조회 (예약번호로)
   */
  async findOne(tenantId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        tenantId,
      },
      include: {
        service: {
          select: {
            name: true,
            category: true,
            price: true,
            durationMinutes: true,
          },
        },
        payment: {
          select: {
            status: true,
            paymentMethod: true,
            paidAt: true,
          },
        },
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return {
      success: true,
      data: booking,
    };
  }

  /**
   * 예약 취소 (고객)
   */
  async cancel(tenantId: string, bookingId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: {
        id: bookingId,
        tenantId,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status === 'cancelled') {
      throw new BadRequestException('Booking is already cancelled');
    }

    if (booking.status === 'completed') {
      throw new BadRequestException('Cannot cancel completed booking');
    }

    // 예약 취소 정책: 예약 시간 24시간 전까지만 취소 가능
    const bookingDateTime = new Date(booking.bookingDate);
    const bookingTime = new Date(booking.bookingTime);
    bookingDateTime.setHours(bookingTime.getHours(), bookingTime.getMinutes());

    const now = new Date();
    const hoursDiff = (bookingDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursDiff < 24) {
      throw new BadRequestException('Cancellation must be made at least 24 hours before the booking time');
    }

    // 예약 취소
    await this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: 'cancelled',
        cancelledAt: new Date(),
        cancelledBy: 'customer',
      },
    });

    // 결제가 완료된 경우, 환불 처리
    if (booking.paymentStatus === 'paid') {
      await this.prisma.payment.update({
        where: { bookingId },
        data: {
          status: 'refunded',
          refundedAt: new Date(),
          refundAmount: booking.totalPrice,
        },
      });
    }

    // 알림 생성
    await this.prisma.notification.create({
      data: {
        tenantId,
        bookingId,
        type: 'booking_cancelled',
        message: `예약이 취소되었습니다. (${booking.customerName})`,
        isRead: false,
      },
    });

    return {
      success: true,
      message: 'Booking cancelled successfully',
    };
  }

  /**
   * 요일을 영문 약자로 변환 (mon, tue, wed, ...)
   */
  private getDayOfWeek(date: Date): string {
    const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
    return days[date.getDay()];
  }
}
