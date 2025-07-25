/**
 * Clase para las caracteristicas del orquestrador
 * @author Juan Gabriel Garzon
 */

import { Injectable } from '@nestjs/common';
import Logging from 'src/common/lib/logging';
import { Etask, ETaskDesc} from 'src/common/utils/enums/taks.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { IGetDataFeaturesUc } from '../get-data-features.uc';
import { IFeaturesUC } from '../orch-features.uc';
import { ITransformFeatureUc } from '../transform-feature.uc.';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { FamilyParams } from "src/common/utils/enums/params.enum";
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';

@Injectable()
export class FeaturesUC implements IFeaturesUC {

    private readonly logger = new Logging(FeaturesUC.name);

    constructor(
        private featureUc: IGetDataFeaturesUc,
        private featureTransform: ITransformFeatureUc,
        public readonly _GetErrorTracing: IGetErrorTracingUc,

    ) { }

    /**
     * orquestador para descargar los archivos del sftp y se valida que si el archivo no ha sido cargado
     * se procesa
     */
    async getOrch(): Promise<any> { 
        try {
            /*
         va y descarga los ficheros sftp y procesa los archivos para hacer un volcado a las diferentes colecciones 
         de terminales y tecnologia una vez volcado , inicia la transformacion de los archivos
         */
            await this.featureUc.getSftpFiles();


            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS, 
                EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);

            await this.featureTransform.transformOriginalData(FamilyParams.equipment);
            await this.featureTransform.transformOriginalData(FamilyParams.technology);
            
            this.logger.write(`Fin del proceso - Features (Terminales-Tecnologia)`, Etask.TRANSFORM_FILE, ELevelsErros.INFO);
            
        } catch (error) {  
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
                EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
            this.logger.write('getOrch() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            await this._GetErrorTracing.getError(error);
            
        }

    }


}

