import { Request } from 'express';

/**
 * JWT 토큰에서 추출한 사용자 정보
 */
export interface JwtPayload {
  sub: string; // userId (adminId 또는 tenantId)
  email: string;
  role: 'admin' | 'tenant';
  tenantId?: string; // tenant인 경우에만 존재
  slug?: string; // tenant인 경우에만 존재
}

/**
 * 인증된 요청
 */
export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

/**
 * Tenant 컨텍스트가 있는 요청 (Public API용)
 */
export interface TenantContextRequest extends Request {
  tenantId: string;
  tenantSlug: string;
}
