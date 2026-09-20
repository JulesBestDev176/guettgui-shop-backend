import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SyncController } from './sync.controller';
import { SyncService } from './sync.service';
import { SyncGateway } from './sync.gateway';
import jwtConfig from '../../config/jwt.config';

@Module({
  imports: [
    ConfigModule.forFeature(jwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [SyncController],
  providers: [SyncService, SyncGateway],
  exports: [SyncGateway],
})
export class SyncModule {}
