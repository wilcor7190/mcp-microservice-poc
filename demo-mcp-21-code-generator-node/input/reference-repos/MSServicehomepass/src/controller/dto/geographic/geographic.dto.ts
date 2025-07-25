import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { GeographicAddressListDto } from './geographicAddresList/geographicAddressList.dto';
import { Type } from 'class-transformer';

export class GeographicDto {
  @Type((type) => GeographicAddressListDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: GeographicAddressListDto, description: 'ubicacion' })
  geographicAddressList: GeographicAddressListDto;
}
