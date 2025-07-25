/**
 *  Paquete del DTO para precios se usan en el ms
 *  @author alexisterzer
 */
import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsEnum, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString } from 'class-validator';
import { FamilyParams, TypeParams } from "src/common/utils/enums/params.enum";


class PriceVersionsObjectPriceDTO {
    @ApiProperty({ description: 'Precio del sku' })
    @IsString()
    amount: string;
}

class VersionsObjectPriceDTO {
    @ApiProperty({ description: 'Versions del sku' })
    @IsString()
    popType: string;

    @ApiProperty({ description: 'Precio del sku' })
    @IsObject()
    price: PriceVersionsObjectPriceDTO;

}

class ObjectPriceDTO {
    @ApiProperty({ description: 'SKU' })
    @IsString()
    id: string;

    @ApiProperty({ description: 'Versions del sku' })
    @IsArray()
    versions: VersionsObjectPriceDTO[];

}

class ProductOfferingPricesDTO {
    @ApiProperty({ description: 'Precios' })
    @IsArray()
    productOfferingPrices?: ObjectPriceDTO[]

    @ApiProperty({ description: 'Precios' })
    @IsOptional()
    family: string | null;
}


class GetProductOfferingResponseDTO {
    @ApiProperty({ description: 'Versions' })
    @IsArray()
    versions: ProductOfferingPricesDTO[];
    
}
class DataDTO {
    @ApiProperty({ description: 'getProductOfferingResponse' })
    @IsArray()
    getProductOfferingResponse: GetProductOfferingResponseDTO[];
}

class ParamsDTO {
    @ApiProperty({ description: 'Parametro que indica la familia objeto' })
    @IsEnum(FamilyParams, {message: 'Familia no valida'})
    family: string;

    @ApiProperty({ description: 'Parametro que indica la familia objeto' })
    @IsEnum(TypeParams, {message: 'Tipo no valido'})
    type: string;

    @ApiProperty({ description: 'Pagina' })
    @IsNotEmpty()
    @IsNumber()
    page: number;
}

export class IPricesListDTO {

    @ApiProperty({ description: 'Parametros' })
    @IsNotEmpty()
    @IsObject()
    params: ParamsDTO;

    @ApiProperty({ description: 'Data del objeto'})
    @IsNotEmpty()
    @IsObject()
    data: DataDTO;
    
}

