import { IsInt, IsString, Min } from "class-validator";

export class InitPaymentDto {
  @IsString()
  orderId: string;

  @IsInt()
  @Min(1)
  amount: number;
}
