import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { EBilling } from '../../../../../../common/utils/enums/params.enum';

export class AgreementRefDto {
  @Type(() => AgreementRefDto)
  @IsNotEmpty()
  @ApiProperty({ description: 'Indica si es seleccionado el envío de factura electronica' })
  @IsEnum(EBilling)
  eBilling: EBilling;
}
