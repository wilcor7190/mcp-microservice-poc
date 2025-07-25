/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_service_error
 * @author alexisterzer
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/taks.enum';
import { IServiceError , ServiceErrorModel} from '@claro/generic-models-library';
import { IServiceErrorProvider } from '../service-error.provider';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import databaseConfig from 'src/common/configuration/database.config';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from 'src/common/utils/enums/tracing.enum';

@Injectable()
export class ServiceErrorProvider implements IServiceErrorProvider {

    constructor(
        @InjectModel(ServiceErrorModel.name,databaseConfig.database) private readonly serviceErrorModel: Model<ServiceErrorModel>,
    ) { }
    
    private readonly logger = new Logging(ServiceErrorProvider.name);

    /**
    * Operación de inserción de un error
    * @param {IServiceError} serviceError arreglo con información del error
    */
    async createServiceError(serviceError: IServiceError) {
        let spanIn: any;
        try {
            const startTime = process.hrtime();
            spanIn = APM.startSpan(ServiceErrorModel.name, MappingApiRest.DB, 'createServiceError', Etask.APM);
            const result = await this.serviceErrorModel.insertMany(serviceError);
            this.logServiceError(startTime, result, serviceError) 
        } catch (error) {
            this.logger.write(error, Etask.SAVE_DATA, ELevelsErros.ERROR);
            this.logger.write('Error ocurrido al guardar datos en coll_service_error', Etask.SAVE_DATA, ELevelsErros.ERROR);
        }finally{
            if(spanIn) spanIn.end();
        }
        
    }

    /**
    * Función para generar log informativo de proceso de inserción en bd de coll_service_error
    * @param {any} startTime cadena fecha inicio consulta bd
    * @param {any} response Arreglo con información de respuesta consulta bd 
    * @param {any} request Arreglo con información de inserción consulta bd 
    * @param {Etask} etask Identificación tarea a insertar en consulta bd 
    */
    logServiceError(startTime: any, response: any, request: any, etask: Etask = Etask.CREATE_SERVICE_ERROR): void {
        const endTime = process.hrtime(startTime);
        const executionTime = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
        this.logger.write(`Insert service_error`, etask, ELevelsErros.INFO, request, response, executionTime)
    }

}