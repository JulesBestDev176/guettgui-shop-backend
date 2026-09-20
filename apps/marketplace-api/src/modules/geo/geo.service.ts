import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class GeoService {
  constructor(private prisma: PrismaService) {}

  getRegions() {
    return this.prisma.region.findMany({
      orderBy: { name: 'asc' },
      select: { id: true, name: true, slug: true },
    });
  }

  getRegion(slug: string) {
    return this.prisma.region.findUniqueOrThrow({
      where: { slug },
      include: {
        departments: {
          orderBy: { name: 'asc' },
          include: { cities: { orderBy: { name: 'asc' } } },
        },
      },
    });
  }

  getDepartments(regionSlug: string) {
    return this.prisma.department.findMany({
      where: { region: { slug: regionSlug } },
      orderBy: { name: 'asc' },
      include: { cities: { orderBy: { name: 'asc' } } },
    });
  }

  getCities(departmentId: string) {
    return this.prisma.city.findMany({
      where: { departmentId },
      orderBy: { name: 'asc' },
    });
  }
}
