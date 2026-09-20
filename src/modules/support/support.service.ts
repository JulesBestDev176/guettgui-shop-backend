import { Injectable } from '@nestjs/common';
import { IsOptional, IsString } from 'class-validator';
import { TicketStatus } from '@prisma/client';
import { PrismaService } from '@/prisma/prisma.service';

export class CreateTicketDto {
  @IsString() name: string;
  @IsString() contact: string;
  @IsString() subject: string;
  @IsString() message: string;
}

@Injectable()
export class SupportService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateTicketDto, userId?: string) {
    return this.prisma.supportTicket.create({ data: { ...dto, userId } });
  }

  findAll(status?: TicketStatus) {
    return this.prisma.supportTicket.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { fullName: true, phone: true } } },
    });
  }

  updateStatus(id: string, status: TicketStatus) {
    return this.prisma.supportTicket.update({ where: { id }, data: { status } });
  }
}
