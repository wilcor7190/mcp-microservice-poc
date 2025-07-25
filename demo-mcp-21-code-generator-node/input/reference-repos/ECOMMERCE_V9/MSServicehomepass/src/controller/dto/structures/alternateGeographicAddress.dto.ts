import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class AlternateGeographicAddressDTO {
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Manzana nivel 1' })
  nivel1Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor manzana nivel 1' })
  nivel1Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Manzana nivel 2' })
  nivel2Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor manzana nivel 2' })
  nivel2Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Manzana nivel 3' })
  nivel3Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor manzana nivel 3' })
  nivel3Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Manzana nivel 4' })
  nivel4Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor manzana nivel 4' })
  nivel4Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Manzana nivel 5' })
  nivel5Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor manzana nivel 5' })
  nivel5Value: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Manzana nivel 6' })
  nivel6Type: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Valor manzana nivel 6' })
  nivel6Value: string;
}
