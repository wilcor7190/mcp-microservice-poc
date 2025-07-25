import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ContextCharacteristicDTO{
    
    @ApiProperty({ type: 'string', required: true, description: "type is required" })
    @IsNotEmpty()
    @IsString()
    "@type": string;

    @ApiProperty({ type: 'string', required: true, description: "name is required" })
    @IsNotEmpty()
    @IsString()
    name: string;
}