import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { GeographicAddressDto } from '../geographic/geographicAddresList/geographicAddress/geographicAddres.dto';

export class GeographicAddressDTO {
  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ type: 'number', description: 'Codigo Dane del centro poblado' })
  daneCode: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsOptional()
  @ApiProperty({ description: 'Barrio de la direccion' })
  neighborhood: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Tipo de la direccion' })
  addressType: string;
}
