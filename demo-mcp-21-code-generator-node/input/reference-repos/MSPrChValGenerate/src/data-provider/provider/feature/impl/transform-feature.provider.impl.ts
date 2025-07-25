/**
 * clase que guarda o elmimina caracteristicas de la coleccion atributos en la db
 * * @author fpiceno
 */
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import Logging from "src/common/lib/logging";
import { Etask, ETaskDesc} from "src/common/utils/enums/taks.enum";
import { GeneralModel } from "src/data-provider/model/general/general.model";
import { IFeatureProvider } from "../transform-feature.provider";
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { FamilyParams } from 'src/common/utils/enums/params.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral,MappingApiRest } from 'src/common/utils/enums/tracing.enum';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { IGeneralDTO } from "src/controller/dto/general/general.dto";
import databaseConfig from "src/common/configuration/database.config";
import * as APM from '@claro/general-utils-library';

export class FeatureProvider implements IFeatureProvider {

    constructor(
        @InjectModel(GeneralModel.name,databaseConfig.database) private readonly featuretModel: Model<GeneralModel>,
        public readonly _GetErrorTracing: IGetErrorTracingUc,
    ) { }

    private readonly logger = new Logging(FeatureProvider.name);

   

    /**
     * Funcion para guadar o añadir las caracteristicas en la coleccion
     * @param {*}general objeto con la estructura para guardar en la colleccion COLPRTPRODUCTOFFERING
     * @returns objetos actualizados
     */
    async saveData(general: IGeneralDTO): Promise<any> {
        let spanIn: any;
        try {
            const START_TIME = process.hrtime();
            spanIn = APM.startSpan(GeneralModel.name, MappingApiRest.DB,'saveData',Etask.APM);
            await this.featuretModel.insertMany(general);

            const processingTime = this.processExecutionTime(START_TIME);
            this.logger.write('Guardando datos en productOffering pagina: ' +general.params.Page , Etask.SAVE_CARACTERISTICAS, ELevelsErros.INFO, '', '', processingTime);
            
        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
                EDescriptionTracingGeneral.FEATURES_COLL_COLPRTPRODUCTOFFERING, ETaskTracingGeneral.SAVE_DATA);
            this.logger.write('Error ocurrido al guardar datos en productOffering', Etask.SAVE_DATA, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.SAVE_DATA, ETaskDesc.SAVE_DATA);
            await this._GetErrorTracing.getError(error);
        }finally{
            if(spanIn) spanIn.end();
        }
    } 

    async deleteDataColPrtProductOffering(params: any,categoria: FamilyParams) : Promise<any>{ 
        let spanIn: any;
        try {

          if(categoria == FamilyParams.technology){
            params.family = FamilyParams.technology
          }
          const START_TIME = process.hrtime();
          spanIn = APM.startSpan(GeneralModel.name, MappingApiRest.DB,'deleteDataColPrtProductOffering',Etask.APM);
          const DELETE = this.featuretModel.deleteMany({ "params.family": params.family, "params.type": params.type }).exec()
          const processingTime = this.processExecutionTime(START_TIME);
          this.logger.write('Borrando data ColPrtProductOffering', Etask.DELETE_DATACOLPRTPRODUCTOFFERING, ELevelsErros.INFO, params, '', processingTime);
          return DELETE;  
        } catch (error) {
          await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
            EDescriptionTracingGeneral.FEATURES_COLL_COLPRTPRODUCTOFFERING, ETaskTracingGeneral.DELETE_DATA);
          this.logger.write('deleteDataColPrtProductOffering()' + error.stack, Etask.DELETE_DATACOLPRTPRODUCTOFFERING,ELevelsErros.ERROR);
          utils.assignTaskError(error, Etask.DELETE_DATACOLPRTPRODUCTOFFERING, ETaskDesc.DELETE_DATA);
          await this._GetErrorTracing.getError(error);
        }finally{
            if(spanIn) spanIn.end();
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



