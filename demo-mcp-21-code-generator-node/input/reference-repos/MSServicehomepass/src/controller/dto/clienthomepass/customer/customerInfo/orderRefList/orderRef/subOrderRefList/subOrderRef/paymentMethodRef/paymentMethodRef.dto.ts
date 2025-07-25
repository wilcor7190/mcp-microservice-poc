import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { ETypePayment } from '../../../../../../../../../../common/utils/enums/params.enum';

export class PaymentMethodRefDto {
  @Type(() => PaymentMethodRefDto)
  @IsEnum(ETypePayment)
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: '   Tipo de pago, posibles valores: CON: Contado (Default)  FIN: Financiado MIX: Pago Mixto' })
  id: ETypePayment;
}
