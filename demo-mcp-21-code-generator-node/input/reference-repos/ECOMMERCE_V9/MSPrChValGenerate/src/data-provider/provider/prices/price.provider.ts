/**
 * clase abstracta para lectura y manejo de archivos
 * * @author Juan Gabriel Garzon
 */
import { Injectable } from "@nestjs/common";
import { IPricesListDTO } from "src/controller/dto/general/prices/price.dto";

@Injectable()
export abstract class IPriceProvider {

    abstract saveTransformData(content: IPricesListDTO): Promise<any>;
    abstract deleteDataColPrtProductOffering(params: any);
    abstract deletePricesCollections(family: string): Promise<void>;
    abstract getJoinPricesFeatures(collection: string, filter: string): Promise<any>;
}