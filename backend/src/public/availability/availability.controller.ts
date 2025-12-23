import { Controller, Get, Query, Param, BadRequestException } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Public()
@Controller(':tenantSlug/availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  /**
   * 예약 가능한 시간 슬롯 조회
   * GET /api/:tenantSlug/availability?serviceId=xxx&date=2025-12-25
   */
  @Get()
  async getAvailableSlots(
    @CurrentTenant() tenantId: string,
    @Query('serviceId') serviceId: string,
    @Query('date') date: string,
  ) {
    if (!serviceId) {
      throw new BadRequestException('serviceId is required');
    }

    if (!date) {
      throw new BadRequestException('date is required (format: YYYY-MM-DD)');
    }

    // 날짜 형식 검증
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      throw new BadRequestException('Invalid date format. Use YYYY-MM-DD');
    }

    return this.availabilityService.getAvailableSlots(tenantId, serviceId, date);
  }
}
