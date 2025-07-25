import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';


export class ProductConfigurationDTO{


    @IsNotEmpty()
    @ApiProperty({ type: 'object', required: true, description: "Context characteristic is required" })
    contextCharacteristic: any;  
    
}