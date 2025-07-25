import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { IHomePricesAttributesProvider } from "src/data-provider/provider/home/homesPricesAttributes.provider";
import { GeneralModel } from "src/data-provider/model/general/general.model";
import databaseConfig from "src/common/configuration/database.config";
import DbConnection from "src/common/utils/dbConnection";
import { CollectionsNames } from "src/common/utils/enums/collectionsNames.enum";
import Logging from "src/common/lib/logging";
import { Etask } from "src/common/utils/enums/taks.enum";
const mongoose = require('mongoose');
import { ELevelsErros } from "src/common/utils/enums/logging.enum";

export class HomePricesAttributesProvider implements IHomePricesAttributesProvider {
    constructor(
        @InjectModel(GeneralModel.name,databaseConfig.database) private readonly generalModel: Model<GeneralModel>
    ) {}

    private readonly logger = new Logging(HomePricesAttributesProvider.name);

    async deleteDataHomeAttributes(): Promise<void> {
        const START_TIME = process.hrtime();
        await (await DbConnection.dbConnectionHomes()).collection(CollectionsNames.HOGARESATTRIBUTES).deleteMany({});
        const processingTime = this.processExecutionTime(START_TIME);
        this.logger.write('Borrando coleccion HomeAttributes', Etask.DELETEDATAHOMEATTRIBUTES, ELevelsErros.INFO, '', '', processingTime);
    }

    async deleteDataHomePrices(): Promise<void> {
        const START_TIME = process.hrtime();
        const processingTime = this.processExecutionTime(START_TIME);
        await (await DbConnection.dbConnectionHomes()).collection(CollectionsNames.HOGARESPRICES).deleteMany({});
        this.logger.write('Borrando datos HomePrices', Etask.DELETEDATAHOMEPRICES, ELevelsErros.INFO, '', '', processingTime);

    }

    async getDataMongoCollection(collection:string): Promise<any> {
        try{
            const START_TIME = process.hrtime();
            const processingTime = this.processExecutionTime(START_TIME);
            await mongoose.connect(databaseConfig.databaseCatalog, {useNewUrlParser: true});
            let coll = mongoose.connection.db.collection(collection);
            this.logger.write('Borrando datos MongoCollection', Etask.FINDDATAMONGOCOLLECTION, ELevelsErros.INFO, collection, '', processingTime);
            return await coll.find({}).toArray();
        
        }finally {
            mongoose.connection.close();
        }
    }

    async getDataMongoCollectionAggregate(collection: string, aggregate?: any): Promise<any> {
        try{
            const START_TIME = process.hrtime();
            const processingTime = this.processExecutionTime(START_TIME);
            this.logger.write('Borrando datos MongoCollectionAggregate', Etask.FINDMONGOCOLLECTIONAGGREGATE, ELevelsErros.INFO, collection, '', processingTime);
            await mongoose.connect(databaseConfig.databaseCatalog, {useNewUrlParser: true});
            let coll = mongoose.connection.db.collection(collection);
            return await coll.aggregate(aggregate).toArray();
        }finally {
            mongoose.connection.close();
        }
        
    }

    async saveDataHomePricesAttributes(content: any): Promise<void> {

        try { 
            const START_TIME = process.hrtime();
            const processingTime = this.processExecutionTime(START_TIME);
            await this.generalModel.insertMany(content);
            this.logger.write('Borrando datos HomePricesAttributes', Etask.SAVE_HOMEPRICESATTRIBUTES, ELevelsErros.INFO, '', '', processingTime);

            
        } catch (error) {
            this.logger.write(' Finish saveDataHomePricesAttributes()'+ error, Etask.ERROR_SAVEDATAHOME_HOMEATTRIBUTESPRICES, ELevelsErros.ERROR);            
        }

    }

    async deleteDataBaseHomeAttributes(params): Promise<any> {

        try {
            const START_TIME = process.hrtime();
            const processingTime = this.processExecutionTime(START_TIME);
            this.logger.write('Borrando datos HomeAttributes', Etask.DELETE_HOMEATRIBUTES, ELevelsErros.INFO, '', '', processingTime);
            return this.generalModel.deleteMany({
                "params.family": params.family,
                "params.type": params.type    
            }); 
            
        } catch (error) {
            this.logger.write(' Error deleteDataBaseHomeAttributes()'+ error, Etask.ERROR_DELETE_HOMEATTRIBUTES, ELevelsErros.ERROR);
            
        }
  
    }

    async deleteDataBaseHomePrices(params): Promise<any> {

        try {
  
            const START_TIME = process.hrtime();
            const processingTime = this.processExecutionTime(START_TIME);
            this.logger.write('Borrando datos HomePrices', Etask.DELETE_PRECIOSHOGARES, ELevelsErros.INFO, '', '', processingTime);
            return this.generalModel.deleteMany({
                "params.family": params.family,
                "params.type": params.type
    
            });
            
        } catch (error) {
            this.logger.write(' Error deleteDataBaseHomePrices()'+ error, Etask.ERROR_DELETE_HOMEPRICES, ELevelsErros.ERROR);            
        }
        
    }

    /**
    * Función para generar log informativo para el services provider de Message
    * @param {any} startTime cadena fecha inicio consulta bd
    */
    processExecutionTime(startTime: any): number {
        const endTime = process.hrtime(startTime);
        return Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
    } 
    
}
