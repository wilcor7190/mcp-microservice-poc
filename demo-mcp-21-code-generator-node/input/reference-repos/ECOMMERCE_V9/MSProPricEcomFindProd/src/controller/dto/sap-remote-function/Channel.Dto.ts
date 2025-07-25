import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ChannelDTO {

    @ApiProperty({ type: 'string', required: true, description: "id is required" })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({ type: 'string', required: true, description: "id is required" })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ type: 'string', required: true, description: "Type is required" })
    @IsNotEmpty()
    @IsString()
    "@type": string;

    @ApiProperty({ type: 'string', required: true, description: "Href is required" })
    @IsNotEmpty()
    @IsString()
    href: string;

}