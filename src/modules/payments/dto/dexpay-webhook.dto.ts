import { IsIn, IsInt, IsOptional, IsString, Min } from "class-validator";

export class DexpayWebhookDto {
  @IsString()
  providerReference: string;

  @IsString()
  orderId: string;

  @IsIn(["SUCCEEDED", "FAILED", "REFUNDED"])
  status: "SUCCEEDED" | "FAILED" | "REFUNDED";

  @IsInt()
  @Min(1)
  amount: number;

  @IsOptional()
  rawPayload?: unknown;
}
