import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { SupportService } from "./support.service";

@ApiTags("support")
@Controller("support/tickets")
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Post()
  create(@Body() body: { subject: string; message: string }) {
    return this.supportService.createTicket(body);
  }
}
