import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { GeoService } from './geo.service';
import { Public } from '@/common/decorators/public.decorator';

@ApiTags('Géographie')
@Public()
@Controller('geo')
export class GeoController {
  constructor(private geo: GeoService) {}

  @Get('regions')
  @ApiOperation({ summary: 'Lister toutes les régions' })
  getRegions() {
    return this.geo.getRegions();
  }

  @Get('regions/:slug')
  @ApiOperation({ summary: 'Détail région avec départements et villes' })
  getRegion(@Param('slug') slug: string) {
    return this.geo.getRegion(slug);
  }

  @Get('regions/:slug/departments')
  @ApiOperation({ summary: 'Départements d\'une région' })
  getDepartments(@Param('slug') slug: string) {
    return this.geo.getDepartments(slug);
  }

  @Get('departments/:departmentId/cities')
  @ApiOperation({ summary: 'Villes d\'un département' })
  getCities(@Param('departmentId') departmentId: string) {
    return this.geo.getCities(departmentId);
  }
}
