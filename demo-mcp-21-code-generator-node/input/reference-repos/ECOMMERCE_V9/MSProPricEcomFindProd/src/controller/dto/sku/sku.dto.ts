import { IsNotEmpty, IsString } from 'class-validator';

export class SkuQueryDto {
  @IsString()
  @IsNotEmpty()
  sku: string;

  @IsString()
  @IsNotEmpty()
  salesType: string;
}