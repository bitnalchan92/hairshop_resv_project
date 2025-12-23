import { Controller, Get, Param } from '@nestjs/common';
import { PublicServicesService } from './public-services.service';
import { Public } from '../../common/decorators/public.decorator';
import { CurrentTenant } from '../../common/decorators/current-tenant.decorator';

@Public()
@Controller(':tenantSlug/services')
export class PublicServicesController {
  constructor(private readonly publicServicesService: PublicServicesService) {}

  /**
   * 특정 스토어의 활성화된 서비스 목록 조회
   * GET /api/jimin-salon/services
   */
  @Get()
  async findAll(@CurrentTenant() tenantId: string) {
    return this.publicServicesService.findAll(tenantId);
  }

  /**
   * 특정 서비스 상세 조회
   * GET /api/jimin-salon/services/:id
   */
  @Get(':id')
  async findOne(
    @CurrentTenant() tenantId: string,
    @Param('id') serviceId: string,
  ) {
    return this.publicServicesService.findOne(tenantId, serviceId);
  }
}
