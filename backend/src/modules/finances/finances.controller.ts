import {
  Controller, Get, Post, Delete,
  Body, Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FinancesService } from './finances.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { CreateSaleDto } from './dto/create-sale.dto';
import { CreateSalePaymentDto } from './dto/create-sale-payment.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { ExpenseCategory, PaymentStatus } from '@prisma/client';

@Controller('teams/:teamId')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Finances')
@ApiBearerAuth()
export class FinancesController {
  constructor(private readonly financesService: FinancesService) {}

  // ─── Expenses ───────────────────────────────────────

  @Post('expenses')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creer une depense' })
  createExpense(
    @Param('teamId') teamId: string,
    @Body() dto: CreateExpenseDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.financesService.createExpense(teamId, dto, userId);
  }

  @Get('expenses')
  @ApiOperation({ summary: 'Liste des depenses' })
  findAllExpenses(
    @Param('teamId') teamId: string,
    @Query() pagination: PaginationDto,
    @Query('category') category?: ExpenseCategory,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.financesService.findAllExpenses(teamId, pagination, category, dateFrom, dateTo);
  }

  @Delete('expenses/:id')
  @ApiOperation({ summary: 'Supprimer une depense (soft delete)' })
  removeExpense(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.financesService.removeExpense(teamId, id);
  }

  // ─── Sales ──────────────────────────────────────────

  @Post('sales')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creer une vente' })
  createSale(
    @Param('teamId') teamId: string,
    @Body() dto: CreateSaleDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.financesService.createSale(teamId, dto, userId);
  }

  @Get('sales')
  @ApiOperation({ summary: 'Liste des ventes' })
  findAllSales(
    @Param('teamId') teamId: string,
    @Query() pagination: PaginationDto,
    @Query('paymentStatus') paymentStatus?: PaymentStatus,
    @Query('productType') productType?: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.financesService.findAllSales(teamId, pagination, paymentStatus, productType, dateFrom, dateTo);
  }

  @Delete('sales/:id')
  @ApiOperation({ summary: 'Supprimer une vente (soft delete)' })
  removeSale(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.financesService.removeSale(teamId, id);
  }

  // ─── Payments ───────────────────────────────────────

  @Post('sales/:id/payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Enregistrer un paiement sur une vente' })
  addPayment(
    @Param('teamId') teamId: string,
    @Param('id') saleId: string,
    @Body() dto: CreateSalePaymentDto,
    @CurrentUser('userId') userId: string,
  ) {
    return this.financesService.addPayment(teamId, saleId, dto, userId);
  }

  // ─── Summary ────────────────────────────────────────

  @Get('finances/summary')
  @ApiOperation({ summary: 'Bilan financier' })
  getSummary(
    @Param('teamId') teamId: string,
    @Query('dateFrom') dateFrom?: string,
    @Query('dateTo') dateTo?: string,
  ) {
    return this.financesService.getSummary(teamId, dateFrom, dateTo);
  }
}
