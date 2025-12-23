import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PublicServicesService {
  constructor(private prisma: PrismaService) {}

  /**
   * 특정 테넌트의 활성화된 서비스 목록 조회
   */
  async findAll(tenantId: string) {
    const services = await this.prisma.service.findMany({
      where: {
        tenantId,
        isActive: true,
      },
      select: {
        id: true,
        category: true,
        name: true,
        description: true,
        price: true,
        durationMinutes: true,
        imageUrl: true,
        displayOrder: true,
      },
      orderBy: [
        { displayOrder: 'asc' },
        { createdAt: 'desc' },
      ],
    });

    return {
      success: true,
      data: services,
    };
  }

  /**
   * 특정 서비스 상세 조회
   */
  async findOne(tenantId: string, serviceId: string) {
    const service = await this.prisma.service.findFirst({
      where: {
        id: serviceId,
        tenantId,
        isActive: true,
      },
      select: {
        id: true,
        category: true,
        name: true,
        description: true,
        price: true,
        durationMinutes: true,
        imageUrl: true,
      },
    });

    if (!service) {
      throw new NotFoundException('Service not found');
    }

    return {
      success: true,
      data: service,
    };
  }
}
