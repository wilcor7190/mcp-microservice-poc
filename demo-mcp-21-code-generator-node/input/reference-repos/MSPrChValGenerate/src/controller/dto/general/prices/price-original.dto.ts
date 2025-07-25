/**
 *  Paquete del DTO para el original de precios que se usan en el ms
 *  @author alexisterzer
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class IPriceOriginalDTO {

    @ApiProperty({ description: 'Equipo' })
    @IsNotEmpty()
    @IsNumber()
    Equipo: number;
    
    @ApiProperty({ description: 'Descripcion Comercial' })
    @IsNotEmpty()
    @IsString()
    Descrip_Comercial: string;

    
    @ApiProperty({ description: 'Material Padre' })
    @IsNotEmpty()
    @IsNumber()
    Material_Padre: number;

    
    @ApiProperty({ description: 'Prec sin IVA sin SIMZP07' })
    @IsNotEmpty()
    @IsString()
    Prec_sin_IVA_sin_SIMZP07: string;

    
    @ApiProperty({ description: 'Precio sin IVAZP06' })
    @IsNotEmpty()
    @IsNumber()
    Precio_sin_IVAZP06: number;

    
    @ApiProperty({ description: 'Precio IVA Final RedZP05' })
    @IsNotEmpty()
    @IsNumber()
    Precio_IVA_FinalRedZP05: number;

    
    @ApiProperty({ description: 'Menos Simcard ZD23' })
    @IsNotEmpty()
    @IsString()
    Menos_SimcardZD23: string;

    
    @ApiProperty({ description: 'IVA SIM' })
    @IsNotEmpty()
    @IsNumber()
    IVA_SIM: number;

    
    @ApiProperty({ description: 'Precio Equipo sin IVAZC01' })
    @IsNotEmpty()
    @IsNumber()
    Pr_Equipo_sin_IVAZC01: number;

    
    @ApiProperty({ description: 'Precio Equipo con IVAZP09' })
    @IsNotEmpty()
    @IsNumber()
    Prec_Equipo_con_IVAZP09: number;

    
    @ApiProperty({ description: 'IVA FINAL' })
    @IsNotEmpty()
    @IsNumber()
    IVA_FINAL: number;

    @ApiProperty({ description: 'Familia' })
    @IsOptional()
    @IsString()
    family?: string;

}