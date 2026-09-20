import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { PlansService, CreatePlanDto, UpdatePlanDto } from './plans.service';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Plans')
@Controller('plans')
export class PlansController {
  constructor(private plans: PlansService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Lister les plans actifs' })
  findAll() {
    return this.plans.findAll();
  }

  @Roles(UserRole.ADMIN)
  @Get('admin')
  @ApiOperation({ summary: 'Tous les plans [ADMIN]' })
  findAllAdmin() {
    return this.plans.findAllAdmin();
  }

  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Créer un plan [ADMIN]' })
  create(@Body() dto: CreatePlanDto) {
    return this.plans.create(dto);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un plan [ADMIN]' })
  update(@Param('id') id: string, @Body() dto: UpdatePlanDto) {
    return this.plans.update(id, dto);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un plan [ADMIN]' })
  remove(@Param('id') id: string) {
    return this.plans.remove(id);
  }
}
