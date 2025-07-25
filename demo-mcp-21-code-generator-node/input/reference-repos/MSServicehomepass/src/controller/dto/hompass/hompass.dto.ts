import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { GeographicAddressListDTO } from './geographicAddressList.dto';

export class HomePassDTO {
  @ApiPropertyOptional({ type: Boolean, default: true, description: 'Indica si el usuario es Inspira o no (Default true).' })
  @IsNotEmpty()
  @IsBoolean()
  isMigratedUser: boolean;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Id de la transaccion generado por el consumidor, debe ser un numero entero en formato texto' })
  transactionId: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Direccion IP del consumidor' })
  ip: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Código dane' })
  daneCode: string;

  @Type()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Dirección de consulta' })
  address: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Tecnología' })
  isDth: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Nodo de consulta' })
  managementNode: string;

  @Type()
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Nombre de usuario' })
  user: string;

  @Type()
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Estrato de la dirección' })
  strata: string;

  @Type(() => GeographicAddressListDTO)
  @IsNotEmpty()
  @ApiProperty({ type: [GeographicAddressListDTO] })
  readonly geographicAddressList: GeographicAddressListDTO[];
}
