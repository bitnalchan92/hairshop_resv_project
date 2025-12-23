import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/**
 * 현재 요청의 tenantId를 가져오는 데코레이터
 *
 * 1. JWT 토큰에서 tenantId 추출 (Tenant API)
 * 2. Middleware에서 설정한 tenantId 추출 (Public API)
 *
 * @example
 * async getServices(@CurrentTenant() tenantId: string) {
 *   return this.servicesService.findAll(tenantId);
 * }
 */
export const CurrentTenant = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();

    // 1. JWT에서 tenantId 추출 (Tenant API)
    if (request.user?.tenantId) {
      return request.user.tenantId;
    }

    // 2. Middleware에서 설정한 tenantId (Public API)
    if (request.tenantId) {
      return request.tenantId;
    }

    throw new Error('TenantId not found in request');
  },
);
