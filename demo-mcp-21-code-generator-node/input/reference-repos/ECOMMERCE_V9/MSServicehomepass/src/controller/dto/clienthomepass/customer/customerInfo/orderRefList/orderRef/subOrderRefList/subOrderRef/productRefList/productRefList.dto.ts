import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ProductRefDto } from './productRef/productRef.dto';

export class ProductRefListDto {
  @Type((type) => ProductRefDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: [ProductRefDto], description: 'ubicacion' })
  productRef: ProductRefDto[];
}
