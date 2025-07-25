import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty } from 'class-validator';
import { GeographicAddressDTO } from './geographicAddress.dto';

export class GeographicAddressListDTO {
  @Type(() => GeographicAddressDTO)
  @IsNotEmpty()
  @ApiProperty({ type: [GeographicAddressDTO] })
  readonly geographicAddress: GeographicAddressDTO[];
}
