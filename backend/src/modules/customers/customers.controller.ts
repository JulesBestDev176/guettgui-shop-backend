import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';

@Controller('teams/:teamId/customers')
@UseGuards(JwtAuthGuard, TeamMemberGuard)
@ApiTags('Customers')
@ApiBearerAuth()
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Creer un client' })
  create(@Param('teamId') teamId: string, @Body() dto: CreateCustomerDto) {
    return this.customersService.create(teamId, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Liste des clients' })
  findAll(@Param('teamId') teamId: string, @Query() pagination: PaginationDto) {
    return this.customersService.findAll(teamId, pagination);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Detail d\'un client avec historique' })
  findOne(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.customersService.findOne(teamId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Modifier un client' })
  update(
    @Param('teamId') teamId: string,
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customersService.update(teamId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un client (soft delete)' })
  remove(@Param('teamId') teamId: string, @Param('id') id: string) {
    return this.customersService.remove(teamId, id);
  }
}
