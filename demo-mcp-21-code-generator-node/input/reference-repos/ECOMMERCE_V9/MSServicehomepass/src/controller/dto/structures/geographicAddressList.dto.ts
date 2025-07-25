import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, ValidateNested } from 'class-validator';
import { GeographicAddressDTO } from './geographicAddress.dto';
import { ComplementsDto } from './complements.dto';
import { AlternateGeographicAddressDTO } from './alternateGeographicAddress.dto';

export class GeographicAddressListDTO {
  @Type(() => GeographicAddressDTO)
  @ValidateNested()
  @ApiProperty({ type: [GeographicAddressDTO] })
  @IsObject()
  readonly geographicAddress: GeographicAddressDTO[];

  @Type(() => ComplementsDto)
  @ApiProperty({ type: [ComplementsDto] })
  @IsObject()
  readonly complements: ComplementsDto[];

  @Type(() => AlternateGeographicAddressDTO)
  @ApiProperty({ type: [AlternateGeographicAddressDTO] })
  @IsObject()
  readonly alternateGeographicAddress: AlternateGeographicAddressDTO[];

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'It tipo placa' })
  plateTypeIt: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'It valor placa' })
  plateValueIt: string;
}
