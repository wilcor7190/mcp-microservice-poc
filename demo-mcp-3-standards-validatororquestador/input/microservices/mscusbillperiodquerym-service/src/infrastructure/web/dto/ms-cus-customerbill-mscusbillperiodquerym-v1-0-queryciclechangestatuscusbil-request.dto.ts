import { IsOptional, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ms-cus-customerbill-mscusbillperiodquerym-v1-0-queryciclechangestatuscusbilRequestDto {
  @IsOptional()
  @IsNumber()
  min: number;

  @IsOptional()
  @IsString()
  custCode: string;

  @IsOptional()
  @IsNumber()
  coId: number;
}