import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';

import { Type } from 'class-transformer';
import { GeographicAddressListDto } from './geographicAddressList/geographicAddressList.dto';

export class GeographicAdDto {
  @Type((type) => GeographicAddressListDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: GeographicAddressListDto, description: 'ubicacion' })
  geographicAddressList: GeographicAddressListDto;
}
