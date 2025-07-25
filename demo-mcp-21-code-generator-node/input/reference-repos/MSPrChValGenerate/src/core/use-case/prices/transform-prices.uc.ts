/**
 * clase para la transformacion de prices
 * @author alexisterzer
 */
import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class ITransformPricesUc {
    abstract transformPrices(collection: string, isEquip: string,family: string ): Promise<any>
    abstract startVariables(): any
    abstract paginationDB(typeG: string): Promise<any>;
}