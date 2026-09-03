import { Injectable, NotFoundException } from "@nestjs/common";
import { UserRole } from "../../common/types/auth-user";
import { UpdateProfileDto } from "./dto/update-profile.dto";

export type UserRecord = {
  id: string;
  fullName: string;
  phone: string;
  email?: string;
  passwordHash: string;
  role: UserRole;
  status: "ACTIVE" | "PENDING" | "SUSPENDED";
};

@Injectable()
export class UsersService {
  private readonly users = new Map<string, UserRecord>();

  async create(input: Omit<UserRecord, "id" | "status">): Promise<UserRecord> {
    const user: UserRecord = {
      ...input,
      id: crypto.randomUUID(),
      status: "ACTIVE",
    };
    this.users.set(user.id, user);
    return user;
  }

  async findById(id: string): Promise<UserRecord | undefined> {
    return this.users.get(id);
  }

  async findByPhone(phone: string): Promise<UserRecord | undefined> {
    return [...this.users.values()].find((user) => user.phone === phone);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<Omit<UserRecord, "passwordHash">> {
    const user = this.users.get(userId);
    if (!user) {
      throw new NotFoundException("Utilisateur introuvable");
    }

    const updated = { ...user, ...dto };
    this.users.set(userId, updated);
    const { passwordHash: _passwordHash, ...safeUser } = updated;
    return safeUser;
  }

  toSafeUser(user: UserRecord) {
    const { passwordHash: _passwordHash, ...safeUser } = user;
    return safeUser;
  }
}
