/**
 * Clase generica para realizar consumos a legados de tipo SOAP y Rest
 * @author Jeniffer Corredor
 */

import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Etask } from './../../common/utils/enums/taks.enum';
import { IHttpProvider } from './../http.provider';
import { IRequestConfigHttp } from '../model/http/request-config-http.model';
import servicesConfig from './../../common/configuration/services.config';
import { ResponseHttp } from './../model/http/response-http.model';
import Logging from './../../common/lib/logging';
import GeneralUtil from '../../common/utils/generalUtil';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import Traceability from 'src/common/lib/traceability';
import { IServiceTracingProvider } from '../service-tracing.provider';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class HttpProvider implements IHttpProvider {

   private readonly logger = new Logging(HttpProvider.name);

   constructor(public readonly _serviceTracing: IServiceTracingProvider,
      private readonly _httpService: HttpService) { }

   /**
    * Operación para realizar un consumo a legados de tipo Rest
    * @param {IRequestConfigHttp} _requestConfig arreglo con información del legado a consumir
    * @param {Etask} _task nombre identificador de la tarea donde se realiza el consumo
    * @returns {ResponseHttp} arreglo con información de respuesta del legado consumido
    */
   async executeRest<R = any>(_requestConfig: IRequestConfigHttp, _task?: Etask): Promise<ResponseHttp<R>> {

      let result: ResponseHttp;

      try {

         this._httpService.axiosRef.interceptors.request.use((config) => {
            config.headers.requestStartedAt = new Date().getTime();
            return config;
         });

         this._httpService.axiosRef.interceptors.response.use(x => {
            x.config.headers.processingTime = (new Date().getTime() - Number(x.config.headers.requestStartedAt));
            return x
         },
            x => {
               x.config.headers.processingTime = (new Date().getTime() - Number(x.config.headers.requestStartedAt));
               throw x;
            }
         )

         let traceability = new Traceability({});
         traceability.setTransactionId(GeneralUtil.getCorrelationalId);
         traceability.setRequest(_requestConfig);
         traceability.setTask('REQUEST_CONSUMO_LEGADO_' + _task);
         this._serviceTracing.createServiceTracing(traceability.getTraceability());

         this.logger.write('Request ejecución HTTP REST', _requestConfig.url, ELevelsErros.INFO, _requestConfig);

         const respose = await lastValueFrom(
            this._httpService.request<R>({
               ..._requestConfig,
               headers: _requestConfig.headers ?? { "content-type": "application/json" },
               responseType: 'json',
               timeout: servicesConfig.httpConfig.timeout
            })
         )

         result = new ResponseHttp(respose);

      }
      catch (error) {
         result = new ResponseHttp(error);
      }

      let response = {
         data: result?.data || result.message,
         status: result.status
      }

      let traceabilityRes = new Traceability({});
      traceabilityRes.setTransactionId(GeneralUtil.getCorrelationalId);
      traceabilityRes.setRequest(_requestConfig);
      traceabilityRes.setResponse(response);
      traceabilityRes.setTask('RESPONSE_CONSUMO_LEGADO_' + _task);
      traceabilityRes.setProcessingTime(result.requestInfo.headers.processingTime);
      traceabilityRes.setStatus(Traceability.getStatusTraceability(result));
      this._serviceTracing.createServiceTracing(traceabilityRes.getTraceability());

      this.logger.write('Resultado ejecución HTTP REST', _requestConfig.url, GeneralUtil.getLevelError(result), _requestConfig, response, result.requestInfo.headers.processingTime);
      return result;
   }
}