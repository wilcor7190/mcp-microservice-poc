import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubOrderRefDto } from './subOrderRef/subOrderRef';

export class SubOrderRefListDto {
  @Type((type) => SubOrderRefDto)
  @IsNotEmpty()
  @ValidateNested()
  @ApiProperty({ type: SubOrderRefDto, description: 'ubicacion' })
  subOrderRef: SubOrderRefDto;
}
