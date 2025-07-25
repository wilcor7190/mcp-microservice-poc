import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';
import { GeographicAddressDto } from '../geographic/geographicAddresList/geographicAddress/geographicAddres.dto';
import { ComplementsDto } from './complements.dto';
import { AlternateGeographicAddressDTO } from './alternateGeographicAddress.dto';

export class GeographicAddressDTO {
  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Tipo de dirección' })
  type: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Tipo de vía principal' })
  streetType: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Numero de vía principal' })
  streetNr: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Vía principal' })
  streetSuffix: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Cuadra vía principal' })
  streetName: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Numero de vía generadora' })
  streetNrGenerator: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Via generadora' })
  streetLtGenerator: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Bis via generadora' })
  streetBisGenerator: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Cuadra via generadora' })
  streetBlockGenerator: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Placa de dirección' })
  plate: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Dirección vía principal' })
  streetAlt: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Barrio de la direccion' })
  neighborhood: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Vía principal' })
  streetLt: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Descripción de nlPostViaP' })
  streetNlPostViaP: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Descripción de nlPostViaP' })
  streetBis: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Descripción de cuadra via principal' })
  streetBlock: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Descripción de nlPostViaG' })
  streetNlPostViaG: string;

  // complements

  @Type(() => ComplementsDto)
  @IsNotEmpty()
  @ApiProperty({ type: ComplementsDto })
  readonly complements: ComplementsDto[];

  // alternateGeographicAddress

  @Type(() => AlternateGeographicAddressDTO)
  @IsNotEmpty()
  @ApiProperty({ type: AlternateGeographicAddressDTO })
  readonly alternateGeographicAddress: AlternateGeographicAddressDTO[];

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Id del catrasto de la direccion' })
  cadastreId: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'It valor placa' })
  plateValueLt: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'It tipo placa' })
  plateTypeLt: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Estado georeferenciacion direccion' })
  geoState: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Id direccion detallada' })
  idDetailAddress: string;

  @Type(() => GeographicAddressDto)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ type: 'string', description: 'Letra 3G' })
  '3GWord': string;
}
