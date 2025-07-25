import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class MediumCharacteristicDto {
  @Type(() => MediumCharacteristicDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Email del cliente ' })
  emailAddress: string;

  @Type(() => MediumCharacteristicDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Numero de celular del cliente' })
  phoneNumber: string;

  @Type(() => MediumCharacteristicDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Codigo OTP de la validación de identidad' })
  idCaseTcrm: string;
}
