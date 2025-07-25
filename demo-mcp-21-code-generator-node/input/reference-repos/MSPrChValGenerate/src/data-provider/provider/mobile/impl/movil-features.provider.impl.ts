/**
 * clase abstracta donde se manipulan ficheros para las colecciones de precios
 * * @author Uriel Esguerra
 */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { IMovilFeaturesDTO } from "src/controller/dto/general/movil/movideFeatures.dto";
import { GeneralModel } from "src/data-provider/model/general/general.model";
import { IMovilPricesDTO } from "src/controller/dto/general/movil/movidePrices.dto";
import { Etask } from "src/common/utils/enums/taks.enum";
import Logging from "src/common/lib/logging";
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import databaseConfig from "src/common/configuration/database.config";
import { IMovilFeaturesProvider } from "../movil-features.provider";

@Injectable()
export class MovilFeaturesProvider implements IMovilFeaturesProvider {
    constructor(
        @InjectModel(GeneralModel.name,databaseConfig.database) private readonly generalModel: Model<GeneralModel>,
        ) {}

    private readonly logger = new Logging(MovilFeaturesProvider.name);

    async saveTransformDataMovilFeature(content: IMovilFeaturesDTO): Promise<any> {
        const START_TIME = process.hrtime();
        this.createLog('Guardando data transform movil features', START_TIME, Etask.SAVE_TRANSFORMDATAMOVILFEATURE);
        await this.generalModel.insertMany(content);
    }
    async saveTransformDataMovilPrices(content: IMovilPricesDTO): Promise<any> {
        const START_TIME = process.hrtime();
        this.createLog('Guardando data transform movil prices', START_TIME, Etask.SAVE_TRANSFORMDATAMOVILPRICES);
        await this.generalModel.insertMany(content);
    }
    async deleteDataMovilFeature(): Promise<any> {
        const START_TIME = process.hrtime();
        this.createLog('Borrando data  movil feature', START_TIME, Etask.DELETE_DATAMOVILFEATURES)
        const myquery = {"params.family":{ "$in": ["Pospago", "Prepago"] },"params.type":"characteristics"};  
        this.generalModel.deleteMany(myquery);
    }
    async deleteDataMovilPrices(): Promise<any> {
        const START_TIME = process.hrtime();
        this.createLog('Borrando data  movil prices', START_TIME, Etask.DELETE_DATAMOVILPRICES)
        const myquery = {"params.family":{ "$in": ["Pospago", "Prepago"] },"params.type":"productOfferingPrices"};  
        this.generalModel.deleteMany(myquery);
    }

        /**
     * Operación para crear log
     * @param {Object} request 
     * @param startTime 
     * @param {Etask} task Tarea realizada
     */
    async createLog(request: any, startTime: any, task: Etask){
        // Calcular el tiempo transcurrido
        const endTime = process.hrtime(startTime);
        const executionTime = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
        this.logger.write(`Consultando información - tiempo de ejecución createLog()`, task, ELevelsErros.INFO,  request, '', executionTime);
  }  

}
