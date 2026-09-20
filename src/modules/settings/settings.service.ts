import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class SettingsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    const settings = await this.prisma.siteSetting.findMany({ orderBy: { key: 'asc' } });
    return settings.reduce<Record<string, string>>((acc, s) => ({ ...acc, [s.key]: s.value }), {});
  }

  async get(key: string) {
    return this.prisma.siteSetting.findUnique({ where: { key } });
  }

  async upsert(key: string, value: string) {
    return this.prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  async upsertMany(data: Record<string, string>) {
    const ops = Object.entries(data).map(([key, value]) =>
      this.prisma.siteSetting.upsert({
        where: { key },
        create: { key, value },
        update: { value },
      }),
    );
    await Promise.all(ops);
    return this.getAll();
  }

  async delete(key: string) {
    return this.prisma.siteSetting.delete({ where: { key } });
  }
}
