import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async sendOtp(dto: SendOtpDto) {
    const { phone } = dto;

    // Generer un code OTP de 6 chiffres
    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Invalider les anciens OTP pour ce numero
    await this.prisma.otpCode.updateMany({
      where: { phone, usedAt: null, expiresAt: { gt: new Date() } },
      data: { usedAt: new Date() },
    });

    // Chercher l'utilisateur existant
    const existingUser = await this.prisma.user.findUnique({ where: { phone } });

    // Stocker le nouvel OTP
    await this.prisma.otpCode.create({
      data: {
        phone,
        code,
        expiresAt,
        userId: existingUser?.id,
      },
    });

    // Envoyer via Relayio (mock en dev)
    await this.sendOtpViaRelayio(phone, code);

    return { message: 'Code OTP envoye avec succes' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const { phone, code } = dto;

    // Chercher le code OTP valide
    const otpRecord = await this.prisma.otpCode.findFirst({
      where: {
        phone,
        code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) {
      throw new BadRequestException('Code OTP invalide ou expire');
    }

    // Marquer comme utilise
    await this.prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { usedAt: new Date() },
    });

    // Creer ou trouver l'utilisateur
    let user = await this.prisma.user.findUnique({ where: { phone } });
    let isNewUser = false;

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          firstName: '',
          lastName: '',
        },
      });
      isNewUser = true;
    }

    // Generer les tokens
    const tokens = await this.generateTokens(user.id, user.phone);

    // Charger les equipes de l'utilisateur
    const memberships = await this.prisma.teamMember.findMany({
      where: { userId: user.id, removedAt: null },
      include: { team: true },
    });

    return {
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        isNewUser,
        user: {
          id: user.id,
          phone: user.phone,
          firstName: user.firstName,
          lastName: user.lastName,
          avatarUrl: user.avatarUrl,
        },
        teams: memberships.map((m) => ({
          id: m.team.id,
          name: m.team.name,
          role: m.role,
        })),
      },
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const { refreshToken } = dto;

    // Verifier le refresh token en BDD
    const tokenRecord = await this.prisma.refreshToken.findUnique({
      where: { token: refreshToken },
      include: { user: true },
    });

    if (!tokenRecord || tokenRecord.revokedAt || tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token invalide ou expire');
    }

    // Revoquer l'ancien token (rotation)
    await this.prisma.refreshToken.update({
      where: { id: tokenRecord.id },
      data: { revokedAt: new Date() },
    });

    // Generer de nouveaux tokens
    const tokens = await this.generateTokens(
      tokenRecord.user.id,
      tokenRecord.user.phone,
    );

    return {
      data: {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async logout(userId: string) {
    // Revoquer tous les refresh tokens de l'utilisateur
    await this.prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });

    return { message: 'Deconnexion reussie' };
  }

  private generateOtpCode(): string {
    // En dev, utiliser un code fixe pour faciliter les tests
    if (this.configService.get('NODE_ENV') === 'development') {
      this.logger.debug('Mode developpement : OTP fixe = 123456');
      return '123456';
    }
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateTokens(userId: string, phone: string) {
    const payload = { sub: userId, phone };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('jwt.secret'),
      expiresIn: this.configService.get<string>('jwt.expiresIn'),
    });

    const refreshTokenValue = uuidv4();
    const refreshExpiresIn = this.configService.get<string>('jwt.refreshExpiresIn') || '30d';
    const days = parseInt(refreshExpiresIn) || 30;
    const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    await this.prisma.refreshToken.create({
      data: {
        userId,
        token: refreshTokenValue,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  private async sendOtpViaRelayio(phone: string, code: string): Promise<void> {
    const isDev = this.configService.get('NODE_ENV') === 'development';
    if (isDev) {
      this.logger.debug(`[MOCK RELAYIO] OTP pour ${phone}: ${code}`);
      return;
    }

    // En production, appeler l'API Relayio
    this.logger.log(`Envoi OTP a ${phone} via Relayio`);
    // TODO: Implementer l'appel HTTP reel a Relayio
  }
}
