import { Injectable } from "@nestjs/common";

@Injectable()
export class SupportService {
  createTicket(input: { subject: string; message: string }) {
    return { id: crypto.randomUUID(), ...input, status: "OPEN" };
  }
}
