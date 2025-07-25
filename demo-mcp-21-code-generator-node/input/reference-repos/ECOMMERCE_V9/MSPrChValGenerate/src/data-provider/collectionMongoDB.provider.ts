/**
 * Clase abstracta del provider de la coleccion
 * @author oscar robayo
 */
import { Injectable } from "@nestjs/common";


@Injectable()
export abstract class ICollectionMongoDBProvider {
    
    abstract getDataMongoCollection (collection:string, filter?: any ): Promise<any>;
    abstract getDataMongoCollectionAggregate (collection:string, aggregate?: any ): Promise<any>;

    abstract getDataMongoCollectionPruebas (collection:string): Promise<any>;


}
