import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { PaginationDto, buildPaginationMeta } from '../../common/dto/pagination.dto';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(teamId: string, dto: CreateOrderDto, userId: string) {
    // Verifier que le client appartient a l'equipe
    const customer = await this.prisma.customer.findFirst({
      where: { id: dto.customerId, teamId, deletedAt: null },
    });
    if (!customer) throw new NotFoundException('Client introuvable');

    return this.prisma.order.create({
      data: {
        teamId,
        customerId: dto.customerId,
        flockId: dto.flockId,
        productType: dto.productType,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        requestedDate: new Date(dto.requestedDate),
        notes: dto.notes,
        recordedById: userId,
      },
    });
  }

  async findAll(teamId: string, pagination: PaginationDto, status?: OrderStatus) {
    const where: Record<string, unknown> = { teamId };
    if (status) where.status = status;

    const [data, total] = await Promise.all([
      this.prisma.order.findMany({
        where: where as never,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { requestedDate: 'asc' },
        include: {
          customer: { select: { id: true, firstName: true, lastName: true, phone: true } },
        },
      }),
      this.prisma.order.count({ where: where as never }),
    ]);

    return { data, meta: buildPaginationMeta(total, pagination) };
  }

  async updateStatus(teamId: string, id: string, dto: UpdateOrderStatusDto, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: { id, teamId },
    });

    if (!order) throw new NotFoundException('Commande introuvable');

    if (order.status === OrderStatus.DELIVERED || order.status === OrderStatus.CANCELLED) {
      throw new BadRequestException('Cette commande ne peut plus etre modifiee');
    }

    // Si livraison -> creer une vente automatiquement
    if (dto.status === OrderStatus.DELIVERED) {
      const unitPrice = dto.unitPrice || order.unitPrice;
      if (!unitPrice) {
        throw new BadRequestException('Le prix unitaire est obligatoire pour la livraison');
      }

      const totalAmount = order.quantity * unitPrice;

      return this.prisma.$transaction(async (tx) => {
        // Creer la vente
        const sale = await tx.sale.create({
          data: {
            teamId,
            flockId: order.flockId,
            customerId: order.customerId,
            orderId: order.id,
            date: new Date(),
            productType: order.productType,
            quantity: order.quantity,
            unitPrice,
            totalAmount,
            paymentStatus: dto.paymentMethod ? PaymentStatus.PAID : PaymentStatus.PENDING,
            amountPaid: dto.paymentMethod ? totalAmount : 0,
            paymentMethod: dto.paymentMethod,
            recordedById: userId,
          },
        });

        // Si paiement, creer le paiement
        if (dto.paymentMethod) {
          await tx.salePayment.create({
            data: {
              saleId: sale.id,
              date: new Date(),
              amount: totalAmount,
              method: dto.paymentMethod,
              recordedById: userId,
            },
          });
        }

        // MAJ statut commande
        await tx.order.update({
          where: { id },
          data: { status: OrderStatus.DELIVERED, unitPrice },
        });

        return { order: { ...order, status: OrderStatus.DELIVERED }, sale };
      });
    }

    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
    });
  }
}
