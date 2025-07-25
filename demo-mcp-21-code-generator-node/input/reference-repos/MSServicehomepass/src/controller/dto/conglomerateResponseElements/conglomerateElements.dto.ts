import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsArray } from 'class-validator';

export class IConglomerateElementsDTO {
  @ApiProperty({ type: 'string', required: false, description: 'This is the name of the variable that stores the name in the response' })
  @IsNotEmpty()
  @IsString()
  nameT: string;

  @ApiProperty({ type: 'string', required: false, description: 'This is the value of nameT variable' })
  @IsNotEmpty()
  @IsString()
  type: string;

  @ApiProperty({ type: 'string', required: false, description: 'This is the name of the variable that stores the value in the response' })
  @IsNotEmpty()
  @IsString()
  nameV: string;

  @ApiProperty({ type: 'number', required: false, description: 'This is the value of nameV variable' })
  @IsNotEmpty()
  @IsArray()
  value: string[] = new Array();

  @ApiProperty({ type: 'number', required: false, description: 'This is the number of the level to know the hierarchy' })
  @IsNotEmpty()
  @IsString()
  lvlnumber: number;
}
