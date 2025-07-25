/**
 *  Paquete del DTO de catalogo que se usan en el ms
 *  @author alexisterzer
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";
import { IFeatureDTO } from "./features.dto";

export class ICatalogDTO {

    @ApiProperty({ description: 'Parametro que indica el Id' })
    @IsNotEmpty()
    @IsString()
    id: string;

    @ApiProperty({ description: 'Parametro que indica el PartNumber' })
    @IsNotEmpty()
    @IsString()
    partNumber: string;

    @ApiProperty({ description: 'Parametro que indica los features' })
    @IsNotEmpty()
    feature: IFeatureDTO[];

    @ApiProperty({ description: 'Parametro que indica el Nombre' })
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({ description: 'Parametro que indica la Descripcion' })
    @IsNotEmpty()
    @IsString()
    description: string;

}

