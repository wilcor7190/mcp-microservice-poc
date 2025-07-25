import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ItemRefListDto } from './itemRefList/itemRefList.dto';
import { EIndTax } from '../../../../../../../../../../../common/utils/enums/params.enum';

export class ProductRefDto {
  @Type(() => ProductRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Identificador del plan (Ejemplo: PO_MovPosPlanNavegalaA018)' })
  planId: string;

  @Type(() => ProductRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Nombre del plan' })
  planDescription: string;

  @Type(() => ProductRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Precio unitario del producto Tecnologia o Terminal (Default 0)' })
  price: string;

  @Type(() => ProductRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Precio unitario del producto Tecnologia o Terminal SIN Incluir IVA (Default 0)' })
  nonTaxPrice: string;

  @Type(() => ProductRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Precio total' })
  totalPrice: string;

  @Type(() => ProductRefDto)
  @IsEnum(EIndTax)
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Precio total' })
  taxInd: EIndTax;

  @Type((type) => ItemRefListDto)
  @ValidateNested()
  @ApiProperty({ type: ItemRefListDto, description: 'ubicacion' })
  itemRefList: ItemRefListDto;
}
