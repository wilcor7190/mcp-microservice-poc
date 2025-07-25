/**
 * clase abstracta para el flujo de  moviles y hogares
 * * @author Oscar Robayo
 */
import { Injectable } from "@nestjs/common";


@Injectable()
export abstract class IHomePricesAttributesProvider {

    abstract deleteDataHomeAttributes(): Promise<void>;
    abstract deleteDataHomePrices(): Promise<void>;

    abstract getDataMongoCollection (collection:string): Promise<any>;
    abstract getDataMongoCollectionAggregate (collection:string, aggregate?: any ): Promise<any>;
    
    abstract saveDataHomePricesAttributes(general: any): Promise<void>;

    abstract deleteDataBaseHomeAttributes(params): Promise<boolean>;
    abstract deleteDataBaseHomePrices(params): Promise<boolean>;


    
}
