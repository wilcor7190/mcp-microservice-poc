import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GeographicAddressDto {
  @Type(() => GeographicAddressDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Id del tipo de direccion' })
  id: string;

  @Type(() => GeographicAddressDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Barrio de la direccion' })
  addressType: string;
}
