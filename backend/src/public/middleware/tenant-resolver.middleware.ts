import { Injectable, NestMiddleware, NotFoundException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * tenantSlug를 tenantId로 변환하는 미들웨어
 *
 * URL 예시: /api/jimin-salon/services
 * - tenantSlug: "jimin-salon"
 * - DB 조회 후 tenantId를 request에 주입
 */
@Injectable()
export class TenantResolverMiddleware implements NestMiddleware {
  constructor(private prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const tenantSlug = req.params.tenantSlug;

    if (!tenantSlug) {
      throw new NotFoundException('Tenant not found');
    }

    // DB에서 tenant 조회
    const tenant = await this.prisma.tenant.findUnique({
      where: { slug: tenantSlug },
      select: {
        id: true,
        slug: true,
        status: true,
        subscriptionStatus: true,
      },
    });

    if (!tenant) {
      throw new NotFoundException(`Store '${tenantSlug}' not found`);
    }

    // 구독 상태 확인
    if (tenant.status !== 'active' || tenant.subscriptionStatus !== 'active') {
      throw new NotFoundException('This store is currently unavailable');
    }

    // request에 tenantId 주입
    (req as any).tenantId = tenant.id;
    (req as any).tenantSlug = tenant.slug;

    next();
  }
}
