import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GeographicAddressDto } from './geographicAddress/geographicAddress.dto';
import { AlternateGeographicAddressDto } from '../../geographic/geographicAddresList/alternateGeographicAddress/alternateGeographicAddress.dto';
import { ComplementsDto } from '../../geographic/geographicAddresList/complements/complements.dto';

export class GeographicAddressListDto {
  @Type((type) => GeographicAddressDto)
  @ValidateNested()
  @ApiProperty({ type: GeographicAddressDto, description: 'ubicacion' })
  geographicAddress: GeographicAddressDto;

  @Type((type) => AlternateGeographicAddressDto)
  @ValidateNested()
  @ApiProperty({ type: AlternateGeographicAddressDto, description: 'ubicacion alterna' })
  alternateGeographicAddress: AlternateGeographicAddressDto;

  @Type((type) => ComplementsDto)
  @ValidateNested()
  @ApiProperty({ type: ComplementsDto, description: 'ubicacion alterna' })
  complements: ComplementsDto;

  @Type(() => GeographicAddressListDto)
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', description: 'It tipo placa' })
  plateTypeIt: string;

  @Type(() => GeographicAddressListDto)
  @IsOptional()
  @IsString()
  @ApiProperty({ type: 'string', description: 'It valor placa' })
  plateValueIt: string;
}
