import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AlternateGeographicAddressDTO {
  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Manzana nivel 1' })
  nivel1Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor Manzana nivel 1' })
  nivel1Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Manzana nivel 2' })
  nivel2Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor Manzana nivel 2' })
  nivel2Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Manzana nivel 3' })
  nivel3Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor Manzana nivel 3' })
  nivel3Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Manzana nivel 4' })
  nivel4Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor Manzana nivel 4' })
  nivel4Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Manzana nivel 5' })
  nivel5Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor Manzana nivel 5' })
  nivel5Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Manzana nivel 6' })
  nivel6Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor Manzana nivel 6' })
  nivel6Value: string;
}
