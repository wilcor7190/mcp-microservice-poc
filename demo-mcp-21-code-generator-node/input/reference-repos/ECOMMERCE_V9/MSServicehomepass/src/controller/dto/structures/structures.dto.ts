import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { GeographicAddressListDTO } from './geographicAddressList.dto';

export class StructuresDTO {
  @Type(() => GeographicAddressListDTO)
  @ValidateNested()
  @ApiProperty({ type: [GeographicAddressListDTO] })
  @IsObject()
  readonly geographicAddressList: GeographicAddressListDTO[];
}
