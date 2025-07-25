import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class GeographicAddressDto {
  @Type(() => GeographicAddressDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Codigo Dane del centro poblado' })
  codeDane: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Id del tipo de direccion' })
  typeAddrMER: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Barrio de la direccion' })
  neighborhood: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Alt vía principal' })
  streetAlt: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Tipo vía principal' })
  streetType: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Numero vía principal' })
  streetNr: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Lote vía principal' })
  streetSuffix: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Nomenclatura posterior via principal' })
  streetNlPostViaP: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Bis Vía principal' })
  streetBis: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Cuadra Vía principal' })
  streetBlockGenerator: string;
}
