/**
 * clase para el ftp de prices
 * @author Gabriel Garzon
 */

import { Injectable } from '@nestjs/common';
import Logging from 'src/common/lib/logging';
import { IPricesUc } from '../orch-prices.uc';
import { IGetDataPricesUc } from '../get-data-prices.uc';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import utils from 'src/common/utils/GeneralUtil';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';

@Injectable()
export class PricesUc implements IPricesUc {

    private readonly logger = new Logging(PricesUc.name);

    constructor(
        private readonly _pricesUc: IGetDataPricesUc,
        public readonly _GetErrorTracing: IGetErrorTracingUc,

    ) { }

    /**
     * Metodo para orquestar la obtencion de los archivos sftp se le manda una bandera para el borrado
     * en true y false 
     */
    async getOrch(): Promise<any> {
        try {
            await this._pricesUc.getSftpFiles();
            
        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
                EDescriptionTracingGeneral.START_PRICES_LOAD_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
            this.logger.write('getOrch() ' + error.tasks, Etask.TRANSFORMDATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            await this._GetErrorTracing.getError(error);
        }
        
    }

    
}

