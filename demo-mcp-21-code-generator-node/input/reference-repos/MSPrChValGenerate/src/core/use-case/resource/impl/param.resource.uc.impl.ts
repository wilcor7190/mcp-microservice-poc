/**
 * Implementa la carga de parametros
 * @author alexisterzer
 */
import { Inject, Injectable } from '@nestjs/common';
import{ CacheModule } from '@nestjs/cache-manager';
import { Cache } from "cache-manager";
import Logging from 'src/common/lib/logging';
import { IParam } from '@claro/generic-models-library';
import { IParamProvider } from 'src/data-provider/param.provider';
import { IServiceErrorUc } from '../service-error.resource.uc';

@Injectable()
export class ParamUcimpl {

    public static params: IParam[];
    private readonly logger = new Logging(ParamUcimpl.name);

    constructor(
        @Inject(CacheModule) public readonly cacheManager: Cache,
        public readonly _paramProvider: IParamProvider,
        public readonly _serviceError: IServiceErrorUc
    ) { }

    public static get getMessages(): IParam[] {
        return ParamUcimpl.params;
    }

   

  

}