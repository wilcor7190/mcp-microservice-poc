/**
 *  Paquete del DTO de caracteristicas que se usan en el ms
 *  @author alexisterzer
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class IFeatureDTO {

    @ApiProperty({ description: 'Parametro que indica el Nombre del feature' })
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @ApiProperty({ description: 'Parametro que indica el Valor del feature' })
    @IsNotEmpty()
    @IsString()
    value: string;
}