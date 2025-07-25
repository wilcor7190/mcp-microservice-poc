/**
 * Clase para el manejo de errores en el ms
 * @author Fredy Santiago Martinez
 */

import { Injectable } from '@nestjs/common';
import { IServiceError } from 'src/core/entity/service-error/service-error.entity';
import { IServiceErrorProvider } from 'src/data-provider/service-error.provider';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { BusinessException } from 'src/common/lib/business-exceptions';
import GeneralUtil from 'src/common/utils/generalUtil';
import { ITaskError } from 'src/core/entity/service-error/task-error.entity';
import Logging from 'src/common/lib/logging';
import { IServiceTracingInicial } from 'src/core/entity/service-tracing/service-tracing.entity';

@Injectable()
export class ServiceErrorUcimpl implements IServiceErrorUc {

    constructor(
        private readonly _serviceErrorProvider: IServiceErrorProvider
    ) { }
    private readonly logger = new Logging(ServiceErrorUcimpl.name);

    /**
    * Funcion para la creación de errores en los ms
    * @param {Object} error arreglo información de error
    * @param {ITaskError} task Identificador de la tarea donde se genero el error
    * @param {IServiceTracingInicial} tracingInfoPrincipal arreglo información adicional donde se genero el error
    */
    async createServiceError(error: any, task: ITaskError, tracingInfoPrincipal:IServiceTracingInicial) {
        this.logger.write(task.description, task.name, true);

        if (error instanceof BusinessException) {
            throw error;
        }
        const dataError: IServiceError = {
            origen: tracingInfoPrincipal.origen,
            message: error.message,
            stack: error.stack,
            request: tracingInfoPrincipal.request,
            channel: tracingInfoPrincipal.channel
        }
        this._serviceErrorProvider.createServiceError(dataError);
        // throw error;
    }

    /**
    * Funcion para consultar información de errores
    * @param {Object} filter Objeto de campos a consultar
    * @returns {Object} informacion asociada a la busqueda
    */
    async getServiceErrors(filter: any): Promise<any> {
        let result = {
            success: false,
            message: '',
            documents: []
        }
        const resultDate = GeneralUtil.validateDate(filter.startDate, filter.endDate);
        if (resultDate === 1 || resultDate > 30) {
            result.message = 'Error en fechas de consulta la fecha de inicio es mayor a la final o existen fechas de mas de 30 dias';
            return result;
        }


        const query = {
            createdAt: {
                $gte: new Date(filter.startDate.toISOString()),
                $lte: new Date(filter.endDate.toISOString())
            }
        };


        const documents = await this._serviceErrorProvider.getServiceErrors(
            query
        );
        if (documents.length > 0) {
            result.success = true;
            result.message = 'Consulta ejecutada correctamente';
            result.documents = documents
            return result;

        }
        else {
            result.message = 'No se encontraron resultados';
            return result
        }
    }
}
