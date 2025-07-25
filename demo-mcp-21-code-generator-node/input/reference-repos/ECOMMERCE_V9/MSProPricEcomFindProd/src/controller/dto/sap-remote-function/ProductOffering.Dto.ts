import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ProductOfferingDTO{
    
    @ApiProperty({ type: 'string', required: true, description: "type is required" })
    @IsNotEmpty()
    @IsString()
    "@type": string;
    
    @ApiProperty({ type: 'string', required: true, description: "href is required" })
    @IsNotEmpty()
    @IsString()
    href: string;

    @ApiProperty({ type: 'string', required: true, description: "id is required" })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({ type: 'string', required: true, description: "name is required" })
    @IsNotEmpty()
    @IsString()
    name: string;
}