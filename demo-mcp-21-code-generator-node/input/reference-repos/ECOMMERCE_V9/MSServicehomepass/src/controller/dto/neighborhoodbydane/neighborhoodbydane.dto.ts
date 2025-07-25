import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class NeighborhoodbydaneDTO {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  @ApiProperty({ type: 'string', description: 'Código dane' })
  daneCode: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ type: 'string', description: 'Addres type' })
  addressType: string;
}
