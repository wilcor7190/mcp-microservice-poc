/**
 * DTO de disponibilidad que se usan en el ms
 *  @author alexisterzer
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsOptional } from "class-validator";


export class IDisponibilityDTO {

    @ApiProperty({ type: 'string', required: false, description: "Parent Product Sku" })
    @IsOptional()
    parentPartNumber?: string;
    
}