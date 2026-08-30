import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { UpdateTeamDto } from './dto/update-team.dto';
import { JoinTeamDto } from './dto/join-team.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TeamMemberGuard } from '../../common/guards/team-member.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { TeamRole } from '@prisma/client';

@Controller('teams')
@ApiTags('Teams')
@ApiBearerAuth()
export class TeamsController {
  constructor(private readonly teamsService: TeamsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Creer une equipe' })
  @ApiResponse({ status: 201, description: 'Equipe creee' })
  create(@Body() dto: CreateTeamDto, @CurrentUser('userId') userId: string) {
    return this.teamsService.create(dto, userId);
  }

  @Get(':teamId')
  @UseGuards(JwtAuthGuard, TeamMemberGuard)
  @ApiOperation({ summary: 'Details de l\'equipe' })
  findOne(@Param('teamId') teamId: string) {
    return this.teamsService.findOne(teamId);
  }

  @Patch(':teamId')
  @UseGuards(JwtAuthGuard, TeamMemberGuard)
  @ApiOperation({ summary: 'Modifier l\'equipe' })
  update(@Param('teamId') teamId: string, @Body() dto: UpdateTeamDto) {
    return this.teamsService.update(teamId, dto);
  }

  @Post('join')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Rejoindre une equipe via code d\'invitation' })
  join(@Body() dto: JoinTeamDto, @CurrentUser('userId') userId: string) {
    return this.teamsService.join(dto, userId);
  }

  @Get(':teamId/members')
  @UseGuards(JwtAuthGuard, TeamMemberGuard)
  @ApiOperation({ summary: 'Liste des membres de l\'equipe' })
  getMembers(@Param('teamId') teamId: string) {
    return this.teamsService.getMembers(teamId);
  }

  @Delete(':teamId/members/:id')
  @UseGuards(JwtAuthGuard, TeamMemberGuard, RolesGuard)
  @Roles(TeamRole.OWNER)
  @ApiOperation({ summary: 'Retirer un membre (OWNER uniquement)' })
  removeMember(
    @Param('teamId') teamId: string,
    @Param('id') memberId: string,
    @CurrentUser('userId') userId: string,
  ) {
    return this.teamsService.removeMember(teamId, memberId, userId);
  }

  @Post(':teamId/regenerate-invite')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, TeamMemberGuard, RolesGuard)
  @Roles(TeamRole.OWNER)
  @ApiOperation({ summary: 'Regenerer le code d\'invitation (OWNER uniquement)' })
  regenerateInviteCode(@Param('teamId') teamId: string) {
    return this.teamsService.regenerateInviteCode(teamId);
  }
}
