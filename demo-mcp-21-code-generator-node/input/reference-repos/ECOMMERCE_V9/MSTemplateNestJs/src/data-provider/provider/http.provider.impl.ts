/**
 * Clase generica para realizar consumos a legados de tipo SOAP y Rest
 * @author Fredy Santiago Martinez
 */

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { Etask } from './../../common/utils/enums/taks.enum';
import { IHttpProvider } from './../http.provider';
import { IRequestConfigHttp, IRequestConfigHttpSOAP } from '../model/http/request-config-http.model';
import servicesConfig from './../../common/configuration/services.config';
import { ResponseHttp } from './../model/http/response-http.model';
import Logging from './../../common/lib/logging';
import GeneralUtil from '../../common/utils/generalUtil';


@Injectable()
export class HttpProvider implements IHttpProvider {

   private readonly logger = new Logging(HttpProvider.name);

   /**
    * Operación para realizar un consumo a legado de tipo Rest
    * @param {IRequestConfigHttp} _requestConfig arreglo con información del legado a consumir
    * @param {Etask} _task nombre identificador de la tarea donde se realiza el consumo
    * @returns {ResponseHttp} arreglo con información de respuesta del legado consumido
    */
   async executeRest<R = any>(_requestConfig: IRequestConfigHttp, _task?: Etask): Promise<ResponseHttp<R>> {

      let result: ResponseHttp;

      try {

         axios.interceptors.request.use(x => {
            x.headers.requestStartedAt = new Date().getTime();
            return x;
         })

         axios.interceptors.response.use(x => {
            x.config.headers.processingTime = (new Date().getTime() - x.config.headers.requestStartedAt);
            return x
         },
            // Handle 4xx & 5xx responses
            x => {
               x.config.headers.processingTime = (new Date().getTime() - x.config.headers.requestStartedAt);
               throw x;
            }
         )

         const respose = await axios.request(
            {
               ..._requestConfig,
               headers: _requestConfig.headers ?? { "content-type": "application/json" },
               responseType: 'json',
               timeout: servicesConfig.httpConfig.timeout
            }
         );

         result = new ResponseHttp(respose);

      }
      catch (error) {
         result = new ResponseHttp(error);
      }

      let response = {
         data: result?.data || result.message,
         status: result.status
      }

      this.logger.write('Resultado ejecución HTTP REST', _requestConfig.url, (result.status === 200 || result.status === 201) ? false : true, _requestConfig, response, result.requestInfo.headers.processingTime);
      return result;
   }

   /**
     * Operación para realizar un consumo a legados de tipo SOAP
     * @param {IRequestConfigHttpSOAP} _requestConfig arreglo con información del legado a consumir
     * @param {Etask} _task nombre identificador de la tarea donde se realiza el consumo
     * @returns {ResponseHttp} arreglo con información de respuesta del legado consumido
     */
   async executeSOAP<R = any>(_requestConfig: IRequestConfigHttpSOAP, _task?: Etask): Promise<ResponseHttp<R>> {

      let result: ResponseHttp;

      try {

         axios.interceptors.request.use(xSoap => {
            xSoap.headers.requestStartedAt = new Date().getTime();
            return xSoap;
         })

         axios.interceptors.response.use(xSoap => {
            xSoap.config.headers.processingTime = (new Date().getTime() - xSoap.config.headers.requestStartedAt);
            return xSoap
         },
            // Handle 4xx & 5xx responses
            xSoap => {
               xSoap.config.headers.processingTime = (new Date().getTime() - xSoap.config.headers.requestStartedAt);
               throw xSoap;
            }
         )

         const respose = await axios.request(
            {
               url: _requestConfig.url,
               data: _requestConfig.data,
               method: 'POST',
               responseType: 'text',
               headers: {
                  "Content-Type": "text/xml;charset=UTF-8",
                  "soapAction": _requestConfig.soapAction
               },
               timeout: servicesConfig.httpConfig.timeout
            }
         );
         result = new ResponseHttp(respose);
      }
      catch (error) {
         result = new ResponseHttp(error);
      }

      //Se transforma respuesta xml del servicio a json
      result.data = await GeneralUtil.convertXmlToJson(result.data);

      let responseSOAP = {
         data: result?.data || result.message,
         status: result.status
      }

      this.logger.write('Resultado ejecución HTTP SOAP', _requestConfig.url, (result.status === 200 || result.status === 201) ? false : true, _requestConfig, responseSOAP, result.requestInfo.headers.processingTime);

      return result;
   }

}