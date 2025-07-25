/**
 *  Paquete del DTO de precios de movil que se usan en el ms
 *  @author Edwin Avila
 */

import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsObject, IsArray } from 'class-validator';

class Price {
    @ApiProperty({ description: 'amount' })
    @IsString()
    amount: string
}


class VersionsObjectPriceDTO {
    @ApiProperty({ description: 'Versions del sku' })
    @IsString()
    popType: string;

    @ApiProperty({ description: 'Precio del sku' })
    @IsString()
    price: Price;
}

class ProductOfferingPricesDTO {
    @ApiProperty({ description: 'Versions del sku' })
    @IsArray()
    versions: VersionsObjectPriceDTO[];

    @ApiProperty({ description: 'Id' })
    @IsString()
    id: string
}

class VersionsDTO {
    @ApiProperty({ description: 'Precios' })
    @IsArray()
    productOfferingPrices: ProductOfferingPricesDTO[];
    @ApiProperty({ description: 'SKU' })
    @IsString()
    family: string;
}

class GetProductOfferingResponseDTO {
    @ApiProperty({ description: 'Versions' })
    @IsArray()
    versions: VersionsDTO[];

    @ApiProperty({ description: 'SKU' })
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

    @ApiProperty({ description: 'Parametro que indica la familia objeto' })
    @IsString()
    type: string;
}

export class IMovilPricesDTO {

    @ApiProperty({ description: 'Parametros' })
    @IsObject()
    params: ColprtproductofferingDTO;

    @ApiProperty({ description: 'Data del objeto'})
    @IsNotEmpty()
    @IsObject()
    data: DataDTO;
    
}

