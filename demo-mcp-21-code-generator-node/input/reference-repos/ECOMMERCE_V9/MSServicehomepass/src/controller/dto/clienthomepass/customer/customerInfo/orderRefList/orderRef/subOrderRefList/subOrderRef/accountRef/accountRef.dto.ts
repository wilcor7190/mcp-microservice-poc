import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { EAccountType } from '../../../../../../../../../../common/utils/enums/params.enum';

export class AccountRefDto {
  @Type(() => AccountRefDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Número de cuenta en la que se realizará la financiación' })
  id: string;

  @Type(() => AccountRefDto)
  @IsEnum(EAccountType)
  @IsNotEmpty()
  @ApiProperty({ type: 'string', description: 'Tipo de cuenta, posibles valores: M: Móvil F: Fija' })
  type: EAccountType;
}
