import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@Controller('health')
@ApiTags('Health')
@SkipThrottle()
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Verification de sante du serveur' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
  }
}
