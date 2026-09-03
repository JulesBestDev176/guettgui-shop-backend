export type UserRole = "CLIENT" | "SELLER" | "DELIVERY" | "ADMIN";

export type AuthUser = {
  id: string;
  role: UserRole;
  phone: string;
};
