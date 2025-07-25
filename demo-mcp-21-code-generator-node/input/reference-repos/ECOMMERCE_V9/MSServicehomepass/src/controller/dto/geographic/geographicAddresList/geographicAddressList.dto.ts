import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { GeographicAddressDto } from './geographicAddress/geographicAddres.dto';
import { GeographicSubAddressDto } from './geographicSubAddress/geographicSubAddress.dto';
import { ComplementsDto } from './complements/complements.dto';
import { AlternateGeographicAddressDto } from './alternateGeographicAddress/alternateGeographicAddress.dto';

export class GeographicAddressListDto {
  @Type((type) => GeographicAddressDto)
  @ValidateNested()
  @ApiProperty({ type: GeographicAddressDto, description: 'ubicacion' })
  geographicAddress: GeographicAddressDto;

  @Type((type) => GeographicSubAddressDto)
  @ValidateNested()
  @ApiProperty({ type: GeographicSubAddressDto, description: 'ubicacion alterna' })
  geographicSubAddress: GeographicSubAddressDto;

  @Type((type) => ComplementsDto)
  @ValidateNested()
  @ApiProperty({ type: ComplementsDto, description: 'ubicacion alterna' })
  complements: ComplementsDto;

  @Type((type) => AlternateGeographicAddressDto)
  @ValidateNested()
  @ApiProperty({ type: AlternateGeographicAddressDto, description: 'ubicacion alterna' })
  alternateGeographicAddress: AlternateGeographicAddressDto;

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
