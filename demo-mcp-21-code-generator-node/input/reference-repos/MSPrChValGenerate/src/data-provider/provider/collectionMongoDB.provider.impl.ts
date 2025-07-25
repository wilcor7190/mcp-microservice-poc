/**
 * Clase con la definición de operaciones para la conexion a db
 * @author Oscar Robayo
 */

import { Injectable } from "@nestjs/common";
import databaseConfig from "src/common/configuration/database.config";
import { ICollectionMongoDBProvider } from "../collectionMongoDB.provider";
const mongoose = require('mongoose');


@Injectable()
export class CollectionMongoDBProvider implements ICollectionMongoDBProvider {

    constructor(
        ) { 
            //Constructor vacio
        }
    async getDataMongoCollectionAggregate(collection: string, aggregate?: any): Promise<any> {
       
        try {
            await mongoose.connect(databaseConfig.databaseCatalog, {useNewUrlParser: true});
            let coll = mongoose.connection.db.collection(collection);
            return await coll.aggregate(aggregate).toArray();
            
            }finally {
                mongoose.connection.close();
            }
    }
    
    async getDataMongoCollection(collection:string, filter: string = "" ): Promise<any> {
        try{
            await mongoose.connect(databaseConfig.databaseCatalog, {useNewUrlParser: true});
            let coll = mongoose.connection.db.collection(collection);
            return await coll.find(filter).toArray();
         
        }finally {
            mongoose.connection.close();
        }
    }

    async getDataMongoCollectionPruebas(collection:string): Promise<any> {
        try{
            await mongoose.connect(databaseConfig.databaseCatalog, {useNewUrlParser: true});
            let coll = mongoose.connection.db.collection(collection);
            return await coll.find({}).toArray();
          
        }finally {
            mongoose.connection.close();
        }
    }

}
