import { ApiProperty } from '@nestjs/swagger';
import { IsString, ValidateNested, IsNotEmpty, IsNotEmptyObject, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { MediumCharacteristicDto } from './mediumCharacteristic/mediumCharacteristic.dto';
import { AgreementRefDto } from './agreementRef/agreementRef.dto';
import { OrderRefListDto } from './orderRefList/orderRefList.dto';
import { EtypeDocument } from '../../../../../common/utils/enums/params.enum';

export class CustomerInfoDto {
  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Documento del cliente ' })
  id: string;

  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  @IsEnum(EtypeDocument)
  @ApiProperty({ type: 'string', description: 'Tipo de cadula del cliente CC: Cedula de ciudadanía CE: Cedula de extranjería  ' })
  idType: EtypeDocument;

  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Nombres del cliente' })
  firstname: string;

  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Apellidos del cliente' })
  lastname: string;

  @Type((type) => MediumCharacteristicDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: MediumCharacteristicDto, description: 'ubicacion' })
  mediumCharacteristic: MediumCharacteristicDto;

  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Número identificador del carrito del ON (Inspira)' })
  scId: string;

  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Codigo OTP de la validación de identidad' })
  transactionIdentity: string;

  @Type(() => CustomerInfoDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Identificador del cliente' })
  profileCustomerId: string;

  @Type((type) => AgreementRefDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: AgreementRefDto, description: 'ubicacion' })
  agreementRef: AgreementRefDto;

  @Type((type) => OrderRefListDto)
  @ValidateNested()
  @ApiProperty({ type: [OrderRefListDto], description: 'ubicacion' })
  orderRefList: OrderRefListDto[];
}
