import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AvailabilityService {
  constructor(private prisma: PrismaService) {}

  /**
   * 특정 서비스의 특정 날짜에 예약 가능한 시간 슬롯 조회
   */
  async getAvailableSlots(
    tenantId: string,
    serviceId: string,
    date: string, // YYYY-MM-DD
  ) {
    // 1. 서비스 조회
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId,
        isActive: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    // 2. 스토어 정보 조회 (영업시간)
    const storeInfo = await this.prisma.storeInfo.findUnique({
      where: { tenantId },
    });

    if (!storeInfo) {
      throw new NotFoundException('Store info not found');
    }

    // 3. 해당 날짜가 휴무일인지 확인
    const targetDate = new Date(date);
    const holiday = await this.prisma.holiday.findFirst({
      where: {
        tenantId,
        holidayDate: targetDate,
      },
    });

    if (holiday) {
      return {
        success: true,
        data: {
          date,
          availableSlots: [],
          isHoliday: true,
          reason: holiday.reason || '휴무일',
        },
      };
    }

    // 4. 요일별 영업시간 확인
    const dayOfWeek = this.getDayOfWeek(targetDate);
    const openingHours = storeInfo.openingHours as any;
    const todayHours = openingHours?.[dayOfWeek];

    if (!todayHours || todayHours === '휴무') {
      return {
        success: true,
        data: {
          date,
          availableSlots: [],
          isHoliday: true,
          reason: '정기 휴무',
        },
      };
    }

    // 5. 영업시간 파싱 (예: "10:00-20:00")
    const [openTime, closeTime] = todayHours.split('-');
    const [openHour, openMinute] = openTime.split(':').map(Number);
    const [closeHour, closeMinute] = closeTime.split(':').map(Number);

    // 6. 해당 날짜의 기존 예약 조회
    const existingBookings = await this.prisma.booking.findMany({
      where: {
        tenantId,
        serviceId,
        bookingDate: targetDate,
        status: { in: ['pending', 'confirmed'] }, // 취소되지 않은 예약만
      },
      select: {
        bookingTime: true,
        durationMinutes: true,
      },
    });

    // 7. 예약된 시간대 계산
    const bookedSlots = existingBookings.map((booking) => {
      const bookingTime = new Date(booking.bookingTime);
      const startMinutes = bookingTime.getHours() * 60 + bookingTime.getMinutes();
      const endMinutes = startMinutes + booking.durationMinutes;
      return { startMinutes, endMinutes };
    });

    // 8. 가능한 시간 슬롯 생성
    const availableSlots: string[] = [];
    const startMinutes = openHour * 60 + openMinute;
    const endMinutes = closeHour * 60 + closeMinute;
    const slotDuration = service.durationMinutes;

    for (let currentMinutes = startMinutes; currentMinutes + slotDuration <= endMinutes; currentMinutes += 30) {
      const slotEndMinutes = currentMinutes + slotDuration;

      // 이 슬롯이 기존 예약과 겹치는지 확인
      const isAvailable = !bookedSlots.some((booked) => {
        // 겹침 조건: 새 슬롯이 기존 예약 시간 범위 안에 있거나 걸치는 경우
        return (
          (currentMinutes >= booked.startMinutes && currentMinutes < booked.endMinutes) ||
          (slotEndMinutes > booked.startMinutes && slotEndMinutes <= booked.endMinutes) ||
          (currentMinutes <= booked.startMinutes && slotEndMinutes >= booked.endMinutes)
        );
      });

      if (isAvailable) {
        const hour = Math.floor(currentMinutes / 60);
        const minute = currentMinutes % 60;
        const timeString = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        availableSlots.push(timeString);
      }
    }

    return {
      success: true,
      data: {
        date,
        serviceName: service.name,
        serviceDuration: service.durationMinutes,
        openingHours: todayHours,
        availableSlots,
        isHoliday: false,
      },
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
