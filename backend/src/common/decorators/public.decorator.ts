import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 인증이 필요 없는 공개 API를 표시하는 데코레이터
 *
 * @example
 * @Public()
 * @Get()
 * getPublicData() {
 *   return 'This is public';
 * }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
