import { Injectable } from '@nestjs/common';
import { IParam } from '@claro/generic-models-library';

import Logging from '../../../../common/lib/logging';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import { ITaskError } from '../../../../core/entity/service-error/task-error.entity';
import { IParamProvider } from '../../../../data-provider/param.provider';
import { IParamUc } from '../param.resource.uc';
import { IServiceErrorUc } from '../service-error.resource.uc';

/**
 * Clase para la configuración de parametros generales
 * @author Santiago Vargas
 */
@Injectable()
export class ParamUcimpl implements IParamUc {

    public static params: IParam[];
    private readonly logger = new Logging(ParamUcimpl.name);

    constructor(
        public readonly _paramProvider: IParamProvider,
        public readonly _serviceError: IServiceErrorUc
    ) { }

    public static get getMessages(): IParam[] {
        return ParamUcimpl.params;
    }

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
            this.logger.write(`Error cargando parámetros`, Etask.LOAD_MESSAGE, error);
        } finally {
            // Actualizar variable estática
            ParamUcimpl.params = param;
        }
    }
}