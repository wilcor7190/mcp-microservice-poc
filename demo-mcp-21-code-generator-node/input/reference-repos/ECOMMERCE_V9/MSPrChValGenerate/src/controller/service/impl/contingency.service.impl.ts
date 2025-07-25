/**
 * Clase para el manejo de promesas en el ms
 * @author Juan Gabriel Garzon
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import Logging from 'src/common/lib/logging';
import { ResponseService } from 'src/controller/dto/response-service.dto';
import { IMobilePricesAttributesUc } from 'src/core/use-case/mobile/orch-mobile-prices-attributes.uc';
import { IFeaturesUC } from 'src/core/use-case/features/orch-features.uc';
import { IPricesUc } from 'src/core/use-case/prices/orch-prices.uc';
import { IHomesPricesAttributesUc } from 'src/core/use-case/home/orch-homes-prices-attributes.uc';
import { IContingencyService } from '../contingency.service';
import { BulkManualDTO } from 'src/controller/dto/general/general.dto';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import utils from 'src/common/utils/GeneralUtil';
import { IServiceErrorUc } from "src/core/use-case/resource/service-error.resource.uc";
import { ITaskError } from "@claro/generic-models-library";
import {EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from "src/common/utils/enums/tracing.enum";
import * as APM from '@claro/general-utils-library';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';

@Injectable()
export class ContingencyService implements IContingencyService {

    constructor(
        private readonly _featuresUC: IFeaturesUC,
        private readonly _pricesUC: IPricesUc,
        private readonly _homesPricesAttributesUc: IHomesPricesAttributesUc,
        private readonly _mobilePricesAttributesUc: IMobilePricesAttributesUc,
        public readonly _serviceError: IServiceErrorUc,
        public readonly _GetErrorTracing: IGetErrorTracingUc,

    ) { }

    private readonly logger = new Logging(ContingencyService.name);

    async getError(error:any, request:any) {
        
        await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
            EDescriptionTracingGeneral.FINAL_PROCESS, ETaskTracingGeneral.FINAL_REQUEST);
        let task: ITaskError = {
            taskName: error?.task_name || '',
            taskDescription: error?.task_description || '',
            description: error._description
        }
        this._serviceError.createServiceError(error, task);

    }

    /**
     * metodo que manda llamar la lectura e inserción de caracteristicas y precios para el flujo 
     * de Equipos y Tecnologia
     * @returns el servicio de que Job ha sido ejecutado
     */
    async getData() {
        const transaction = await APM.startTransaction(`getData - loadCron attributes & prices`);
        try {
            this.logger.write('loadCron attributes & prices', Etask.START_CRON_ATTRIBUTES, ELevelsErros.INFO)
            await this._featuresUC.getOrch();
            await this._pricesUC.getOrch();

        } catch (error) {
            this.logger.write('getData() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            await this.getError(error, 'Job caracteristicas - precios (Terminales y tecnologia)' )
        }finally {
            transaction.end();
        }
    }

    /**
     * Metodo que manda a ejecutar el flujo de Prices y attributos para Movil
     * @returns el servicio de que Job ha sido ejecutado de manera exitosa
     */
    async getDataMobile() {
        try {
            await this._mobilePricesAttributesUc.getOrchMobile();

        } catch (error) {
            this.logger.write('getDataMobile() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            await this.getError(error, 'Job caracteristicas - precios (Moviles)')
        }

    }

    /**
     * Metodo que manda a ejecutar el flujo de Prices y attributos para Home
     * @returns el servicio de que Job ha sido ejecutado de manera exitosa
     */
    async getDataHomes() {
        try {
            await this._homesPricesAttributesUc.getOrchHomes();
        } catch (error) {
            this.logger.write('getDataHomes() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            await this.getError(error,'Job caracteristicas - precios (Hogares)')
        }

    }

    /**
     * Metodo que manda a ejecutar cualquier flujo dependiendo de los parametros recibos
     * @returns el servicio de que Job ha sido ejecutado de manera exitosa
     */
    async getDataManual(req: BulkManualDTO): Promise<ResponseService<any>> {

        try {

            if (req.fileType == "Caracteristicas") {
                switch (req.category) {
                    case "Hogares":
                         this._homesPricesAttributesUc.getHomeAttributes();
                        break;

                    case "Movil":
                         this._mobilePricesAttributesUc.getMovileAttributes();
                        break;

                    case "Equipos":
                         this._featuresUC.getOrch();
                        break;

                    default:
                        this.logger.write('getDataManual()', Etask.ERROR_OPTION, ELevelsErros.WARNING)
                        break;
                }
            } else if (req.fileType == "Precios") {
                switch (req.category) {
                    case "Hogares":
                         this._homesPricesAttributesUc.getHomePrices();
                        break;

                    case "Movil":
                         this._mobilePricesAttributesUc.getMobilePrices();
                        break;

                    case "Equipos":
                         this._pricesUC.getOrch();
                        break;

                    default:
                        this.logger.write('getDataManual()', Etask.ERROR_OPTION, ELevelsErros.WARNING)
                        break;
                }
            } else {
                this.logger.write('getDataManual()', Etask.ERROR_OPTION, ELevelsErros.WARNING)
            }

            return new ResponseService(
                true,
                'La Carga ha iniciado',
                HttpStatus.OK,
                {}
            )
        } catch (error) {
            this.logger.write('getDataManual() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            await this.getError(error, req )
        }


    }

    

}
