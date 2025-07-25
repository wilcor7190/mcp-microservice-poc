import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemRefDto } from './itemRef/itemRef.dto';

export class ItemRefListDto {
  @Type((type) => ItemRefDto)
  @ValidateNested()
  @ApiProperty({ type: [ItemRefDto], description: 'ubicacion' })
  itemRef: ItemRefDto[];
}
