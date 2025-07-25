/**
 * Clase generica para realizar consumos a legados de tipo SOAP y Rest
 * @author alexisterzer
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { Agent, request } from 'undici';
import servicesConfig from './../../common/configuration/services.config';
import { Etask } from './../../common/utils/enums/taks.enum';
import { IHttpProvider } from './../http.provider';
import { IRequestConfigHttp } from '../model/http/request-config-http.model';
import { ResponseHttp } from './../model/http/response-http.model';
import Logging from './../../common/lib/logging';
import GeneralUtil from '../../common/utils/GeneralUtil';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { IServiceTracingProvider } from '../service-tracing.provider';
import Traceability from 'src/common/lib/traceability'; 



@Injectable()
export class HttpProvider implements IHttpProvider {

   private readonly logger = new Logging(HttpProvider.name);

   constructor(
      public readonly _serviceTracing: IServiceTracingProvider,

   ) {
      //Constructor Vacio
   }


   async executeRest<R = any>(_requestConfig: IRequestConfigHttp, _task?: Etask): Promise<ResponseHttp<R>> {

      let result: ResponseHttp;
      const startTime = process.hrtime();
      try {

         const response = await request(this.getUrl(_requestConfig), {
            method: _requestConfig.method,
            headers: _requestConfig?.headers || { 'content-type': 'application/json' },
            body: this.getBody(_requestConfig.data),
            dispatcher: new Agent({ connectTimeout: servicesConfig.httpConfig.timeout }),
            headersTimeout: servicesConfig.httpConfig.headersTimeout
          });
         
         result = new ResponseHttp({
            ...response,
            data: await this.getData(response),
            config: { ..._requestConfig, headers: response.headers }
         });
      }
      catch (error) {
         return new ResponseHttp(error);
      }

      const endTime = process.hrtime(startTime);
      const executionTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);

      let traceabilityRes = new Traceability({});
      traceabilityRes.setTransactionId(GeneralUtil.getCorrelationalId);
      traceabilityRes.setRequest(_requestConfig);
      traceabilityRes.setTask('RESPONSE_CONSUMO_LEGADO_CONSUMO OMNSERVICE');
      traceabilityRes.setProcessingTime(executionTime);
      traceabilityRes.setStatus(Traceability.getStatusTraceability(result));
      this._serviceTracing.createServiceTracing(traceabilityRes.getTraceability());

      if (!result.executed) {

         let document = {
            document: {
               source: result.requestInfo.url,
               info: result.message
            },
            codMessage: EmessageMapping.ERROR_TIMEOUT_LEGACY
         }
         throw new BusinessException(
            HttpStatus.CREATED,
            EmessageMapping.ERROR_TIMEOUT_LEGACY,
            true,
            document
         );

      }
      return result;



   }

   
  /**
   * Gestiona la conversion de la data para una solicitud Http
   * @param {any} data Parámetros enviados a una solicitud Http
   * @returns {string | undefined}Si data se encuentra definido, devolvera un `string` de lo contrario `undefined`
   */
  private getBody(data: any): string | undefined {
   if (!data) return undefined;
   if (typeof data === 'string') return data;
   if (typeof data === 'object') return JSON.stringify(data);
   return undefined;
 }

 /**
  * Crea la url de consulta de acuerdo a la configuración
  * @param {IRequestConfigHttp} requestConfig Objeto de configuración para solicitudes Http
  * @returns {string} Url de la petición
  */
 private getUrl(requestConfig: IRequestConfigHttp): string {
   if (!requestConfig.params) return requestConfig.url;
   return `${requestConfig.url}?${new URLSearchParams(requestConfig.params).toString()}`;
 }

 /**
  * Resulve la promesa de acuerdo al contenido de la respuesta.
  * @param response Objeto de respuesta entregado por Undici
  * @returns {Promise<any>}
  */
 private async getData(response: any): Promise<any> {
   return response.headers['content-type'].includes('application/json') ? response.body.json() : response.body.text();
 }

}