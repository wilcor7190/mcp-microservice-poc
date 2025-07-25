import { Inject, Injectable } from '@nestjs/common';
import { Cache } from "cache-manager";
import { IParamUc } from '../param.resource.uc';
import { IParam } from '../../../../core/entity/param/param.entity';
import { IParamProvider } from '../../../../data-provider/param.provider';
import Logging from '../../../../common/lib/logging';
import { Etask, ETaskDesc } from '../../../../common/utils/enums/taks.enum';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { ELevelsErros } from '../../../../common/utils/enums/logging.enum';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ITaskError } from '@claro/generic-models-library/src/core/entity';

@Injectable()
export class ParamUcimpl implements IParamUc {

    public static params: IParam[];
    private readonly logger = new Logging(ParamUcimpl.name);

    constructor(
        @Inject(CACHE_MANAGER) public readonly cacheManager: Cache,
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
                taskName: Etask.ERROR_LOAD_PARAM,
                taskDescription: ETaskDesc.ERROR_LOAD_PARAM
            }
            await this._serviceError.createServiceError(error, task);
            this.logger.write(`Error cargando parámetros`, Etask.LOAD_MESSAGE, ELevelsErros.ERROR, error);
        } finally {
            // Actualizar variable estática
            ParamUcimpl.params = param;
        }
    }

  

}