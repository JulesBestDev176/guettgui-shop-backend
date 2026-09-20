import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { FcmService } from './fcm.service';
import { RelayioService } from './relayio.service';

@Module({
  providers: [NotificationsService, FcmService, RelayioService],
  exports: [NotificationsService, FcmService, RelayioService],
})
export class NotificationsModule {}
