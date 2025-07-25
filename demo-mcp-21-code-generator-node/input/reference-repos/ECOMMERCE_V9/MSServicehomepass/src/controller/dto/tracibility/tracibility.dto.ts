import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class TracibilityDTO {
  @ApiProperty({ required: true, description: 'This is startDate of query' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;
}
