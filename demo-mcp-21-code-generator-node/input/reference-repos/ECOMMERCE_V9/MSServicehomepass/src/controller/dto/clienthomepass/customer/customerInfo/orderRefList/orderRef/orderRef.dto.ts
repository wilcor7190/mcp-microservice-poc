import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SubOrderRefListDto } from './subOrderRefList/subOrderRefList.dto';

export class OrderRefDto {
  @Type(() => OrderRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Número de orden generado en eCommerce' })
  id: string;

  @Type(() => OrderRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Date', description: 'Fecha y hora de la creación de la orden (Formato: yyyy-mm-dd hh24:mi:ss)' })
  date: Date;

  @Type((type) => SubOrderRefListDto)
  @ValidateNested()
  @ApiProperty({ type: [SubOrderRefListDto], description: 'ubicacion' })
  subOrderRefList: SubOrderRefListDto[];
}
