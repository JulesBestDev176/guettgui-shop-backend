import { Injectable } from "@nestjs/common";
import { DexpayWebhookDto } from "./dto/dexpay-webhook.dto";
import { InitPaymentDto } from "./dto/init-payment.dto";

@Injectable()
export class PaymentsService {
  initDexpay(dto: InitPaymentDto) {
    return {
      provider: "DEXPAY",
      orderId: dto.orderId,
      amount: dto.amount,
      paymentUrl: `https://pay.dexpay.example/${dto.orderId}`,
      status: "PENDING",
    };
  }

  handleWebhook(dto: DexpayWebhookDto) {
    return {
      accepted: true,
      provider: "DEXPAY",
      reference: dto.providerReference,
      status: dto.status,
    };
  }
}
