import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsDate, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class IErrorDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'This is page of query' })
  page?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @ApiProperty({ required: false, description: 'This is limit of query' })
  limit?: number;

  @ApiProperty({ required: true, description: 'This is startDate of query' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ required: true, description: 'This is endDate of query' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
