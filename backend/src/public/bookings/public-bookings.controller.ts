import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PublicBookingsService } from './public-bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Public()
@Controller(':tenantSlug/bookings')
export class PublicBookingsController {
  constructor(private readonly publicBookingsService: PublicBookingsService) {}

  /**
   * 예약 생성
   * POST /api/:tenantSlug/bookings
   */
  @Post()
  async create(
    @CurrentTenant() tenantId: string,
    @Body() createBookingDto: CreateBookingDto,
  ) {
    return this.publicBookingsService.create(tenantId, createBookingDto);
  }

  /**
   * 예약 조회
   * GET /api/:tenantSlug/bookings/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') bookingId: string,
  ) {
    return this.publicBookingsService.findOne(tenantId, bookingId);
  }

  /**
   * 예약 취소
   * DELETE /api/:tenantSlug/bookings/:id
   */
  @Delete(':id')
  async cancel(
    @CurrentTenant() tenantId: string,
    @Param('id') bookingId: string,
  ) {
    return this.publicBookingsService.cancel(tenantId, bookingId);
  }
}
