/**
 * Clase abstracta generica para realizar consumos a legados de tipo SOAP y Rest
 * @author Fredy Santiago Martinez
 */

import { Injectable } from '@nestjs/common';
import { Etask } from 'src/common/utils/enums/taks.enum';
import { IRequestConfigHttp } from './model/http/request-config-http.model';

import { ResponseHttp } from './model/http/response-http.model';

@Injectable()
export abstract class IHttpProvider {

    /**
    * Operación para realizar un consumo a legado de tipo Rest
    * @param {IRequestConfigHttp} _requestConfig arreglo con información del legado a consumir
    * @param {Etask} _task nombre identificador de la tarea donde se realiza el consumo
    */
    abstract executeRest<R = any>(_requestConfig: IRequestConfigHttp, _task?: Etask | string): Promise<ResponseHttp<R>>;

}