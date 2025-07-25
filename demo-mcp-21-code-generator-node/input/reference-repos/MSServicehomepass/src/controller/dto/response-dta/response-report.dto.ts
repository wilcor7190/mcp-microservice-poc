import { ApiProperty } from '@nestjs/swagger';

export class ResponsereportDTO<T = any> {
  @ApiProperty({
    description: 'Valor que representa el campo result',
  })
  public result?: string;

  @ApiProperty({
    description: 'Valor que representa el campo code',
  })
  public code?: string;

  @ApiProperty({
    description: 'Valor que representa el campo description',
  })
  public description?: string;

  @ApiProperty({
    description: 'Valor que representa el campo type',
  })
  public type?: string;

  constructor(result: string, code: string, description: string, type: string) {
    this.result = result;
    this.code = code;
    this.description = description;
    this.type = type;
  }
}
