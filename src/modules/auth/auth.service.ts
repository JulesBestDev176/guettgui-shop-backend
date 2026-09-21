import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare, hash } from 'bcryptjs';
import { randomBytes } from 'crypto';
import slugify from 'slugify';
import { PrismaService } from '@/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const REFRESH_EXPIRES_DAYS = 30;
const ACCESS_EXPIRES = '15m';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const [existingPhone, existingEmail] = await Promise.all([
      this.prisma.user.findUnique({ where: { phone: dto.phone } }),
      dto.email ? this.prisma.user.findUnique({ where: { email: dto.email } }) : null,
    ]);

    if (existingPhone) throw new ConflictException('Ce numéro est déjà utilisé');
    if (existingEmail) throw new ConflictException('Cet email est déjà utilisé');

    const passwordHash = await hash(dto.password, 12);

    // Determine role — if shopName provided, default to SELLER
    const isSeller = dto.role === 'SELLER' || (!dto.role && !!dto.shopName);
    const role: 'CLIENT' | 'SELLER' = isSeller ? 'SELLER' : 'CLIENT';

    let shopData: any = undefined;
    if (isSeller && dto.shopName) {
      const [freePlan, regionRecord, cityRecord] = await Promise.all([
        this.prisma.plan.findUnique({ where: { code: 'FREE' } }),
        dto.region
          ? this.prisma.region.findFirst({ where: { name: { equals: dto.region, mode: 'insensitive' } } })
          : null,
        dto.city
          ? this.prisma.city.findFirst({ where: { name: { equals: dto.city, mode: 'insensitive' } } })
          : null,
      ]);
      const baseSlug = slugify(dto.shopName, { lower: true, strict: true });
      const shopSlug = await this.uniqueShopSlug(baseSlug);
      shopData = {
        create: {
          name: dto.shopName,
          slug: shopSlug,
          ...(regionRecord && { regionId: regionRecord.id }),
          ...(cityRecord && { cityId: cityRecord.id }),
          ...(freePlan && {
            subscription: { create: { planId: freePlan.id, status: 'ACTIVE' } },
          }),
        },
      };
    }

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        email: dto.email,
        passwordHash,
        role,
        ...(shopData && { shop: shopData }),
      },
      select: { id: true, fullName: true, phone: true, role: true, shop: { select: { id: true, slug: true, name: true } } },
    });

    const tokens = await this.generateTokens(user.id, user.role);
    return { user, ...tokens };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
      select: { id: true, fullName: true, phone: true, role: true, status: true, passwordHash: true },
    });

    if (!user) throw new UnauthorizedException('Identifiants incorrects');
    if (user.status === 'SUSPENDED') throw new UnauthorizedException('Compte suspendu');

    const valid = await compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Identifiants incorrects');

    const { passwordHash: _, ...safeUser } = user;
    const tokens = await this.generateTokens(user.id, user.role);
    return { user: safeUser, ...tokens };
  }

  async refresh(token: string) {
    const stored = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { user: { select: { id: true, role: true, status: true } } },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Token de rafraîchissement invalide');
    }

    if (stored.user.status !== 'ACTIVE') {
      throw new UnauthorizedException('Compte inactif');
    }

    // Rotate refresh token
    await this.prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() },
    });

    const tokens = await this.generateTokens(stored.user.id, stored.user.role);
    return tokens;
  }

  async logout(token: string) {
    await this.prisma.refreshToken.updateMany({
      where: { token },
      data: { revokedAt: new Date() },
    });
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        phone: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        shop: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true,
            verified: true,
            subscription: { select: { status: true, plan: { select: { code: true, name: true } } } },
          },
        },
      },
    });
  }

  private async generateTokens(userId: string, role: string) {
    const accessToken = this.jwt.sign({ sub: userId, role }, { expiresIn: ACCESS_EXPIRES });

    const refreshTokenValue = randomBytes(40).toString('hex');
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_EXPIRES_DAYS);

    await this.prisma.refreshToken.create({
      data: { userId, token: refreshTokenValue, expiresAt },
    });

    return { accessToken, refreshToken: refreshTokenValue };
  }

  private async uniqueShopSlug(base: string): Promise<string> {
    let slug = base;
    let i = 1;
    while (await this.prisma.shop.findUnique({ where: { slug } })) {
      slug = `${base}-${i++}`;
    }
    return slug;
  }
}
