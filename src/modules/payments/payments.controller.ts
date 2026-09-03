import { Body, Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { DexpayWebhookDto } from "./dto/dexpay-webhook.dto";
import { InitPaymentDto } from "./dto/init-payment.dto";
import { PaymentsService } from "./payments.service";

@ApiTags("payments")
@Controller("payments")
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post("dexpay/init")
  initDexpay(@Body() dto: InitPaymentDto) {
    return this.paymentsService.initDexpay(dto);
  }

  @Post("dexpay/webhook")
  webhook(@Body() dto: DexpayWebhookDto) {
    return this.paymentsService.handleWebhook(dto);
  }
}
