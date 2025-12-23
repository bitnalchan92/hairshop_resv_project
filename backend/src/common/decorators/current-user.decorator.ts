import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '../types/request.interface';

/**
 * 현재 인증된 사용자 정보를 가져오는 데코레이터
 *
 * @example
 * async getProfile(@CurrentUser() user: JwtPayload) {
 *   return user;
 * }
 */
export const CurrentUser = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): JwtPayload | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    // 특정 필드만 반환
    return data ? user?.[data] : user;
  },
);
