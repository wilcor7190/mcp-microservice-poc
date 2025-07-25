import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerDto } from './customer/customer.dto';

export class CLienthomepassDto {
  @Type((type) => CustomerDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: CustomerDto, description: 'ubicacion' })
  customer: CustomerDto;
}
