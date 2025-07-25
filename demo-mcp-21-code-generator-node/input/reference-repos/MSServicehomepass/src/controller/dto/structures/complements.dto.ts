import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ComplementsDto {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Postal Code nivel 1' })
  nivel1Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor postal code nivel 1' })
  nivel1Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Postal Code nivel 2' })
  nivel2Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor postal code nivel 2' })
  nivel2Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Postal Code nivel 3' })
  nivel3Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor postal code nivel 3' })
  nivel3Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Postal Code nivel 4' })
  nivel4Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor postal code nivel 4' })
  nivel4Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Postal Code nivel 5' })
  nivel5Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor postal code nivel 5' })
  nivel5Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Postal Code nivel 6' })
  nivel6Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor postal code nivel 6' })
  nivel6Value: string;
}
