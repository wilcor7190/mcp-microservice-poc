import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { ProductOfferingDTO } from './ProductOffering.Dto';

export class RequestProductConfigurationItemDTO{

    
    @ApiProperty({ type: 'string', required: true, description: "type is required" })
    @IsNotEmpty()
    @IsString()
    "@type": string;

    @IsNotEmpty()
    @ApiProperty({ type: 'object', required: true, description: "Request Product Configuration Item is required" })
    @ValidateNested()
    @Type(() => ProductOfferingDTO)
    productOffering: ProductOfferingDTO;  
}