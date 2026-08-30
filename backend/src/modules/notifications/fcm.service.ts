import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface FcmMessage {
  title: string;
  body: string;
  data?: Record<string, string>;
}

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  constructor(private readonly configService: ConfigService) {}

  async send(fcmToken: string, message: FcmMessage): Promise<void> {
    const isDev = this.configService.get('NODE_ENV') === 'development';

    if (isDev) {
      this.logger.debug(`[MOCK FCM] Push to ${fcmToken.substring(0, 10)}... : ${message.title}`);
      return;
    }

    // En production : utiliser firebase-admin pour envoyer la notification
    this.logger.log(`Envoi push notification: ${message.title}`);
  }

  async sendToMultiple(fcmTokens: string[], message: FcmMessage): Promise<void> {
    await Promise.all(
      fcmTokens.filter(Boolean).map((token) => this.send(token, message)),
    );
  }
}
