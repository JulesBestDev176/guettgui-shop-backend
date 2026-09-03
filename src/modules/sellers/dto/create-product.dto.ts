import { IsInt, IsOptional, IsPositive, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  categoryId: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsInt()
  @IsPositive()
  basePrice: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsString()
  unit: string;
}
