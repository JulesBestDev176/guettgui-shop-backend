import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(teamId: string, dto: CreateCustomerDto) {
    return this.prisma.customer.create({
      data: { teamId, ...dto },
    });
  }

  async findAll(teamId: string, pagination: PaginationDto) {
    const where = { teamId, deletedAt: null };

    const [data, total] = await Promise.all([
      this.prisma.customer.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.customer.count({ where }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async findOne(teamId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, teamId, deletedAt: null },
      include: {
        sales: {
          where: { deletedAt: null },
          orderBy: { date: 'desc' },
          take: 20,
        },
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 20,
        },
      },
    });

    if (!customer) {
      throw new NotFoundException('Client introuvable');
    }

    // Calculer le solde des creances
    const debts = await this.prisma.sale.aggregate({
      where: {
        customerId: id,
        teamId,
        deletedAt: null,
        paymentStatus: { in: [PaymentStatus.PENDING, PaymentStatus.PARTIAL] },
      },
      _sum: { totalAmount: true, amountPaid: true },
    });

    const totalOwed = (debts._sum.totalAmount || 0) - (debts._sum.amountPaid || 0);

    return { ...customer, totalOwed };
  }

  async update(teamId: string, id: string, dto: UpdateCustomerDto) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, teamId, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundException('Client introuvable');
    }

    return this.prisma.customer.update({
      where: { id },
      data: dto,
    });
  }

  async remove(teamId: string, id: string) {
    const customer = await this.prisma.customer.findFirst({
      where: { id, teamId, deletedAt: null },
    });

    if (!customer) {
      throw new NotFoundException('Client introuvable');
    }

    return this.prisma.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
