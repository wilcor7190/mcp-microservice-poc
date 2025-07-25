import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderRefDto } from './orderRef/orderRef.dto';

export class OrderRefListDto {
  @Type((type) => OrderRefDto)
  @ValidateNested()
  @ApiProperty({ type: OrderRefDto, description: 'ubicacion' })
  orderRef: OrderRefDto;
}
