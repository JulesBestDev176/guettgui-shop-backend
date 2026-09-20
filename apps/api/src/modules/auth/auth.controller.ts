import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('send-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 900000, limit: 5 } })
  @ApiOperation({ summary: 'Envoyer un code OTP par SMS/WhatsApp' })
  @ApiResponse({ status: 200, description: 'OTP envoye avec succes' })
  @ApiResponse({ status: 429, description: 'Trop de tentatives' })
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto);
  }

  @Post('verify-otp')
  @HttpCode(HttpStatus.OK)
  @Throttle({ default: { ttl: 900000, limit: 10 } })
  @ApiOperation({ summary: 'Verifier le code OTP et obtenir les tokens' })
  @ApiResponse({ status: 200, description: 'Authentification reussie' })
  @ApiResponse({ status: 400, description: 'Code OTP invalide ou expire' })
  verifyOtp(@Body() dto: VerifyOtpDto) {
    return this.authService.verifyOtp(dto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rafraichir le token d\'acces' })
  @ApiResponse({ status: 200, description: 'Nouveau token genere' })
  @ApiResponse({ status: 401, description: 'Refresh token invalide' })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Deconnecter l\'utilisateur' })
  @ApiResponse({ status: 200, description: 'Deconnexion reussie' })
  logout(@CurrentUser('userId') userId: string) {
    return this.authService.logout(userId);
  }
}
