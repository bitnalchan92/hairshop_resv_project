import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
    console.log('✅ Database connected successfully');
  }

  async onModuleDestroy() {
    await this.$disconnect();
    console.log('👋 Database disconnected');
  }

  /**
   * 트랜잭션 헬퍼 메서드
   */
  async executeTransaction<T>(fn: (prisma: PrismaClient) => Promise<T>): Promise<T> {
    return await this.$transaction(fn);
  }

  /**
   * 테넌트별 데이터 격리를 위한 헬퍼 메서드
   * 사용 예: prismaService.forTenant(tenantId).booking.findMany()
   */
  forTenant(tenantId: string) {
    return {
      // Tenant 관련 모델들에 자동으로 tenantId 필터 적용
      booking: {
        findMany: (args?: any) =>
          this.booking.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findFirst: (args?: any) =>
          this.booking.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findUnique: (args?: any) =>
          this.booking.findUnique({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) =>
          this.booking.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) =>
          this.booking.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
        delete: (args: any) =>
          this.booking.delete({
            ...args,
            where: { ...args.where, tenantId },
          }),
      },
      service: {
        findMany: (args?: any) =>
          this.service.findMany({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        findFirst: (args?: any) =>
          this.service.findFirst({
            ...args,
            where: { ...args?.where, tenantId },
          }),
        create: (args: any) =>
          this.service.create({
            ...args,
            data: { ...args.data, tenantId },
          }),
        update: (args: any) =>
          this.service.update({
            ...args,
            where: { ...args.where, tenantId },
          }),
      },
      // 필요시 다른 모델들도 추가
    };
  }
}
