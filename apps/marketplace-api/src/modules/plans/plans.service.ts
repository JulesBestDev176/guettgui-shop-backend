import { Injectable, NotFoundException } from '@nestjs/common';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PlanCode } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

export class CreatePlanDto {
  @IsString() name: string;
  @IsString() @IsOptional() description?: string;
  @IsInt() @Min(0) priceMonthly: number;
  @IsInt() @Min(0) maxProducts: number;
  @IsBoolean() @IsOptional() canBeVerified?: boolean;
  @IsBoolean() @IsOptional() canBeFeatured?: boolean;
  @IsInt() @IsOptional() sortOrder?: number;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

export class UpdatePlanDto {
  @IsString() @IsOptional() name?: string;
  @IsString() @IsOptional() description?: string;
  @IsInt() @Min(0) @IsOptional() priceMonthly?: number;
  @IsInt() @Min(0) @IsOptional() maxProducts?: number;
  @IsBoolean() @IsOptional() canBeVerified?: boolean;
  @IsBoolean() @IsOptional() canBeFeatured?: boolean;
  @IsInt() @IsOptional() sortOrder?: number;
  @IsBoolean() @IsOptional() isActive?: boolean;
}

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.plan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  findAllAdmin() {
    return this.prisma.plan.findMany({ orderBy: { sortOrder: 'asc' } });
  }

  async findById(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plan introuvable');
    return plan;
  }

  create(dto: CreatePlanDto) {
    return this.prisma.plan.create({ data: dto as any });
  }

  async update(id: string, dto: UpdatePlanDto) {
    await this.findById(id);
    return this.prisma.plan.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.plan.delete({ where: { id } });
  }
}
