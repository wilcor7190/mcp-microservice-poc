/**
 * Clase para la configuración de parametros generales
 * @author Fredy Santiago Martinez
 */

import { Injectable } from '@nestjs/common';
import { IParamUc } from '../param.resource.uc';
import { IParam } from 'src/core/entity/param/param.entity';
import { IParamProvider } from 'src/data-provider/param.provider';
import Logging from 'src/common/lib/logging';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { ITaskError } from 'src/core/entity/service-error/task-error.entity';

@Injectable()
export class ParamUcimpl implements IParamUc {

    public static params: IParam[] = [];
    private readonly logger = new Logging(ParamUcimpl.name);

    constructor(
        public readonly _paramProvider: IParamProvider,
        public readonly _serviceError: IServiceErrorUc
    ) { }

    /**
    * Al cargar el modulo se ejecuta la lógica de carga de mensajes en memoria
    */
    async onModuleInit() {
        await this.loadParams();
    }

    /**
    * Función para cargar los parametros en las variables estaticas
    */
    async loadParams(): Promise<any> {
        let param: IParam[] = [];
        try {
            param = await this._paramProvider.getParams(1, 100, {});
        } catch (error) {
            let task: ITaskError = {
                name: Etask.ERROR_LOAD_PARAM,
                description: ETaskDesc.ERROR_LOAD_PARAM
            }
            await this._serviceError.createServiceError(error, task);
            this.logger.write(`Error cargando parámetros`, Etask.LOAD_MESSAGE, true, error);
        } finally {
            // Actualizar variable estática
            ParamUcimpl.params = param;
        }
    } 

}