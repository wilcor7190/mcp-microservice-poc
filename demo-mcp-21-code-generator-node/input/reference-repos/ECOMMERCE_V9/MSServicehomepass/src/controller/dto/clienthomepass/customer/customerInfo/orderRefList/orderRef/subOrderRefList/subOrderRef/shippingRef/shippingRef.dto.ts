import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Type } from 'class-transformer';

export class ShippingRefDto {
  @Type(() => ShippingRefDto)
  @IsString()
  @Length(1, 10)
  @IsNotEmpty()
  @ApiProperty({ type: 'Código DANE del municipio (ciudad) (5 digitos)' })
  daneCodeCity: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Ciudad' })
  city: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @Length(1, 2)
  @IsNotEmpty()
  @ApiProperty({ type: 'Código DANE del departamento (2 digitos)' })
  daneCodeProvince: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Departamento' })
  province: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @Length(1, 8)
  @IsNotEmpty()
  @ApiProperty({ type: 'Centro Poblado' })
  villageCenterDaneCode: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Barrio' })
  villageCenter: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Barrio' })
  neighborhood: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Direccion normalizada' })
  address: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Regional' })
  region: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Id de la dirección normalizada' })
  addressId: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Estrato' })
  strata: string;

  @Type(() => ShippingRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Tipo de tecnología (Default MOV)' })
  technology?: string = 'MOV';
}
