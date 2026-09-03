import { Injectable, NotFoundException } from "@nestjs/common";
import { User } from "@prisma/client";
import { PrismaService } from "../../database/prisma.service";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: Omit<User, "id" | "status" | "createdAt" | "updatedAt">): Promise<User> {
    return this.prisma.user.create({ data: input });
  }

  async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Omit<User, "passwordHash">> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    const updated = await this.prisma.user.update({
      where: { id: userId },
      data: dto,
    });

    const { passwordHash: _passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  toSafeUser(user: User): Omit<User, "passwordHash"> {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
