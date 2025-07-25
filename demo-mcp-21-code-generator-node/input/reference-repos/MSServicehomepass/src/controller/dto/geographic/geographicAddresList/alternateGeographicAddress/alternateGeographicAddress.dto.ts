import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AlternateGeographicAddressDto {
  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 1' })
  nivel1Type: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Value postal code nivel 1' })
  nivel1Value: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 2' })
  nivel2Type: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Value postal Code nivel 2' })
  nivel2Value: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 3' })
  nivel3Type: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Value postal Code nivel 3' })
  nivel3Value: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 4' })
  nivel4Type: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Value postal Code nivel 4' })
  nivel4Value: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 5' })
  nivel5Type: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Value postal Code nivel 5' })
  nivel5Value: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Postal Code nivel 6' })
  nivel6Type: string;

  @Type(() => AlternateGeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Value postal Code nivel 6' })
  nivel6Value: string;
}
