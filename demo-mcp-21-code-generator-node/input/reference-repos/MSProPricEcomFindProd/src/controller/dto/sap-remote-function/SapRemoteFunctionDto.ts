import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ChannelDTO } from './Channel.Dto';
import { ProductConfigurationDTO } from './ProductConfiguration.Dto';


export class SapRemoteFunctionDto {


    @ApiProperty({ type: 'string', required: true, description: "type is required" })
    @IsNotEmpty()
    @IsString()
    "@type": string;

    @IsNotEmpty()
    @ApiProperty({ type: 'object', required: true, description: "channel is required" })
    @ValidateNested()
    @Type(() => ChannelDTO)
    channel: ChannelDTO;

    @ApiProperty({ type: 'object', required: true, description: "Product configuration is required" })
    @ValidateNested()
    @Type(() => ProductConfigurationDTO)
    productConfiguration: ProductConfigurationDTO;  


}
