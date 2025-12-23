import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { PublicServicesController } from './services/public-services.controller';
import { PublicServicesService } from './services/public-services.service';
import { AvailabilityController } from './availability/availability.controller';
import { AvailabilityService } from './availability/availability.service';
import { PublicBookingsController } from './bookings/public-bookings.controller';
import { PublicBookingsService } from './bookings/public-bookings.service';
import { TenantResolverMiddleware } from './middleware/tenant-resolver.middleware';

@Module({
  controllers: [
    PublicServicesController,
    AvailabilityController,
    PublicBookingsController,
  ],
  providers: [
    PublicServicesService,
    AvailabilityService,
    PublicBookingsService,
  ],
})
export class PublicModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // :tenantSlug로 시작하는 모든 라우트에 Tenant Resolver Middleware 적용
    consumer
      .apply(TenantResolverMiddleware)
      .forRoutes(':tenantSlug/*');
  }
}
