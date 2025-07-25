/**
 * Paquete de la configuracion general de los DTO que se usan en el ms
 * @author alexisterzer
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty,IsObject, IsEnum,IsNumber ,IsArray,IsString} from "class-validator";
import { FamilyParams, TypeParams } from "src/common/utils/enums/params.enum";

class ParamsDto {
    @ApiProperty({ description: 'Parametro que indica la familia objeto' })
    @IsEnum(FamilyParams, {message: 'Familia no valida'})
    family: string;

    @ApiProperty({ description: 'Parametro que indica la familia objeto' })
    @IsEnum(TypeParams, {message: 'Tipo no valido'})
    type: string;

    @ApiProperty({ description: 'Pagina' })
    @IsNotEmpty()
    @IsNumber()
    Page: number;
}

class DataDto {
    @ApiProperty({ description: 'getProductOfferingResponse' })
    @IsArray()
    getProductOfferingResponse: GetProductOfferingResponseDTO[];
}

class GetProductOfferingResponseDTO {
    @ApiProperty({ description: 'Versions' })
    @IsArray()
    versions: ProductOfferingDTO[];

    @ApiProperty({ description: 'SKU' })
    @IsString()
    id: string;
    
}

class ProductOfferingDTO {
    @ApiProperty({ description: 'SKU' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Nombre Equipo' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Descripcion del equipo' })
    @IsString()
    description: string;

    @ApiProperty({ description: 'specificationType' })
    @IsString()
    specificationType: string;

    @ApiProperty({ description: 'Objeto caracteristicas' })
    @IsArray()
    characteristics: ObjectCharacteristicsDTO[]
    
}

class ObjectCharacteristicsDTO {
    @ApiProperty({ description: 'ID Caracteristica' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Version caracteristica' })
    @IsArray()
    versions: VersionsObjectCharacteristicsDTO[];

}

class VersionsObjectCharacteristicsDTO {
    @ApiProperty({ description: 'Valor de la caracteristica' })
    @IsString()
    value: string;

    @ApiProperty({ description: 'Nombre de la caracteristica' })
    @IsString()
    name: string;
}

export class IGeneralDTO {

    @ApiProperty({ description: 'Parametro que indica la familia y el tipo del objeto' })
    @IsNotEmpty()
    @IsObject()
    params: ParamsDto;

    @ApiProperty({ description: 'Data del objeto' })
    @IsNotEmpty()
    @IsObject()
    data: DataDto;

}

export class BulkManualDTO {
    @ApiProperty({ description: 'Categoría del archivo' })
    @IsNotEmpty()
    category: string;

    @ApiProperty({ description: 'Tipo del archivo (caracteristicas o precios)' })
    @IsNotEmpty()
    fileType: string;
}
