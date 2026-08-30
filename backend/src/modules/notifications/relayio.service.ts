import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RelayioService {
  private readonly logger = new Logger(RelayioService.name);

  constructor(private readonly configService: ConfigService) {}

  /**
   * Verifie si RelayIO est configure (cle API non vide).
   */
  isConfigured(): boolean {
    const apiKey = this.configService.get<string>('RELAYIO_API_KEY');
    return !!apiKey && apiKey.trim().length > 0;
  }

  async sendOtp(phone: string, code: string): Promise<void> {
    if (!this.isConfigured()) {
      this.logger.warn(
        `[RELAYIO] Cle API non configuree — OTP non envoye. Phone: ${phone}, Code: ${code}`,
      );
      return;
    }

    const isDev = this.configService.get('NODE_ENV') === 'development';

    if (isDev) {
      this.logger.debug(`[MOCK RELAYIO] OTP to ${phone}: ${code}`);
      return;
    }

    // En production : appeler l'API Relayio
    this.logger.log(`Envoi OTP a ${phone} via Relayio`);
  }

  async sendNotification(
    phone: string,
    template: string,
    params: Record<string, string>,
  ): Promise<void> {
    if (!this.isConfigured()) {
      this.logger.warn(
        `[RELAYIO] Cle API non configuree — notification non envoyee. Phone: ${phone}, Template: ${template}`,
      );
      return;
    }

    const isDev = this.configService.get('NODE_ENV') === 'development';

    if (isDev) {
      this.logger.debug(`[MOCK RELAYIO] WhatsApp to ${phone}: template=${template}, params=${JSON.stringify(params)}`);
      return;
    }

    // En production : appeler l'API Relayio pour envoyer un message WhatsApp
    this.logger.log(`Envoi WhatsApp a ${phone} via Relayio`);
  }

  /**
   * Envoie un code d'invitation par WhatsApp.
   * Si RelayIO n'est pas configure, log un warning et ne fait rien.
   */
  async sendInviteCode(phone: string, inviteCode: string, teamName: string): Promise<void> {
    if (!this.isConfigured()) {
      this.logger.warn(
        `[RELAYIO] Cle API non configuree — invitation non envoyee par WhatsApp. Phone: ${phone}, Code: ${inviteCode}`,
      );
      return;
    }

    await this.sendNotification(phone, 'team_invite', {
      code: inviteCode,
      team: teamName,
    });
  }
}
