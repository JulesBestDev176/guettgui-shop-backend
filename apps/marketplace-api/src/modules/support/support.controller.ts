import { Body, Controller, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TicketStatus, UserRole } from '@prisma/client';
import { SupportService, CreateTicketDto } from './support.service';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';
import { CurrentUser } from '@/common/decorators/current-user.decorator';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private support: SupportService) {}

  @Public()
  @Post('tickets')
  @ApiOperation({ summary: 'Créer un ticket de support' })
  create(@Body() dto: CreateTicketDto, @CurrentUser() user?: { id: string }) {
    return this.support.create(dto, user?.id);
  }

  @Roles(UserRole.ADMIN)
  @Get('tickets')
  @ApiOperation({ summary: 'Lister les tickets [ADMIN]' })
  findAll(@Query('status') status?: TicketStatus) {
    return this.support.findAll(status);
  }

  @Roles(UserRole.ADMIN)
  @Patch('tickets/:id/status')
  @ApiOperation({ summary: 'Changer statut ticket [ADMIN]' })
  updateStatus(@Param('id') id: string, @Body('status') status: TicketStatus) {
    return this.support.updateStatus(id, status);
  }
}
