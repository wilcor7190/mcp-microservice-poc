/**
 *  Paquete del DTO de caracteristicas de movil que se usan en el ms
 *  @author Uriel Esguerra
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsObject, IsArray } from 'class-validator';


class VersionsObjectPriceDTO {
    @ApiProperty({ description: 'Versions del sku' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Precio del sku' })
    @IsString()
    value: string;
}

class CharacteristicsDTO {
    @ApiProperty({ description: 'Versions del sku' })
    @IsArray()
    versions: VersionsObjectPriceDTO[];
}

class VersionsDTO {
    @ApiProperty({ description: 'Precios' })
    @IsArray()
    characteristics: CharacteristicsDTO[];
    @ApiProperty({ description: 'family' })
    @IsString()
    family: string;
}

class GetProductOfferingResponseDTO {
    @ApiProperty({ description: 'Versions' })
    @IsArray()
    versions: VersionsDTO[];

    @ApiProperty({ description: 'id' })
    @IsString()
    id: string;
}
class DataDTO {
    @ApiProperty({ description: 'getProductOfferingResponse' })
    @IsArray()
    getProductOfferingResponse: GetProductOfferingResponseDTO[];
}

class ColprtproductofferingDTO {
    @ApiProperty({ description: 'Parametro que indica la familia objeto' })
    @IsString()
    family: string;

    @ApiProperty({ description: 'Parametro que indica la typo objeto' })
    @IsString()
    type: string;
}

export class IMovilFeaturesDTO {

    @ApiProperty({ description: 'Parametros' })
    @IsObject()
    params: ColprtproductofferingDTO;

    @ApiProperty({ description: 'Data del objeto'})
    @IsNotEmpty()
    @IsObject()
    data: DataDTO;
    
}

