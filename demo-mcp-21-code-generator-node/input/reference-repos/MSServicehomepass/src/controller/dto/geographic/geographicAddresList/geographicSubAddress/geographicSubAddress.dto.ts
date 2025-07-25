import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class GeographicSubAddressDto {
  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Tipo de vía generadora' })
  streetTypeGenerator: string;

  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Numero de vía generadora' })
  streetNrGenerator: string;

  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Letra de vía generadora' })
  streetLtGenerator: string;

  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Nomenclatura posterior via generadora' })
  streetNlPostViaG: string;

  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Letra 3G' })
  word3G: string;

  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Bis  de vía generadora' })
  streetBisGenerator: string;

  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Cuadra de vía generadora' })
  streetName: string;

  @Type(() => GeographicSubAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Placa de la direccion' })
  plate: string;
}
