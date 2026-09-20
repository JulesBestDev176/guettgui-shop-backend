import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { SettingsService } from './settings.service';
import { Public } from '@/common/decorators/public.decorator';
import { Roles } from '@/common/decorators/roles.decorator';

@ApiTags('Paramètres site')
@Controller('settings')
export class SettingsController {
  constructor(private settings: SettingsService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Tous les paramètres du site' })
  getAll() {
    return this.settings.getAll();
  }

  @Roles(UserRole.ADMIN)
  @Patch()
  @ApiOperation({ summary: 'Mettre à jour plusieurs paramètres [ADMIN]' })
  upsertMany(@Body() data: Record<string, string>) {
    return this.settings.upsertMany(data);
  }

  @Roles(UserRole.ADMIN)
  @Patch(':key')
  @ApiOperation({ summary: 'Mettre à jour un paramètre [ADMIN]' })
  upsert(@Param('key') key: string, @Body('value') value: string) {
    return this.settings.upsert(key, value);
  }

  @Roles(UserRole.ADMIN)
  @Delete(':key')
  @ApiOperation({ summary: 'Supprimer un paramètre [ADMIN]' })
  delete(@Param('key') key: string) {
    return this.settings.delete(key);
  }
}
