import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmptyObject, IsBoolean, IsString, ValidateNested, IsNotEmpty, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { CustomerInfoDto } from './customerInfo/customerInfo.dto';

export class CustomerDto {
  @Type(() => CustomerDto)
  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty({ type: 'boolean', default: true, description: 'Indica si el usuario es Inspira o no. (Default true)' })
  isMigratedUser?: boolean = true;

  @Type((type) => CustomerDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', default: true, description: 'Usuario quien realiza la transaccion' })
  user: string;

  @Type((type) => CustomerDto)
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ type: 'string', default: true, description: 'IP del dispositivo donde se realizo la compra' })
  ip: string;

  @Type((type) => CustomerDto)
  @IsDateString()
  @IsNotEmpty()
  @ApiProperty({ type: 'Date', description: 'Fecha del request en formato datetime' })
  requestDate: Date;

  @Type((type) => CustomerInfoDto)
  @IsNotEmptyObject()
  @ValidateNested()
  @ApiProperty({ type: CustomerInfoDto, description: 'ubicacion' })
  customerInfo: CustomerInfoDto;
}
