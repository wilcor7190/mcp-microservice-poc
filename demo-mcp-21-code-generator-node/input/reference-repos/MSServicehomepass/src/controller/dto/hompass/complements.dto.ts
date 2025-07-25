import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class ComplementsDto {
  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 1' })
  nivel1Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor postal code nivel 1' })
  nivel1Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 2' })
  nivel2Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor postal code nivel 2' })
  nivel2Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 3' })
  nivel3Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor postal code nivel 3' })
  nivel3Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 4' })
  nivel4Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor postal code nivel 4' })
  nivel4Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 5' })
  nivel5Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor postal code nivel 5' })
  nivel5Value: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 6' })
  nivel6Type: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Valor postal code nivel 6' })
  nivel6Value: string;
}
