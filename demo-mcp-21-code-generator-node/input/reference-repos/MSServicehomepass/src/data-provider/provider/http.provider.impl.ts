/**
 * Clase para realizar el consumo y llamado de servicios REST y SOAP
 * @author Andrea Perez Guzman
 */
import { HttpStatus, Injectable } from '@nestjs/common';

import { BusinessException } from 'src/common/lib/business-exceptions';
import Logging from 'src/common/lib/logging';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { Etask } from 'src/common/utils/enums/task.enum';
import { EStatusTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { IHttpProvider } from '../http.provider';
import { IRequestConfigHttp } from '../model/http/request-config-http.model';
import { ResponseHttp } from '../model/http/response-http.model';
import { IServiceTracingProvider } from '../service-tracing.provider';
import { Agent, request } from 'undici';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import Traceability  from 'src/common/lib/traceability';
import GeneralUtil from 'src/common/utils/generalUtil';
import servicesConfig from 'src/common/configuration/services.config';

@Injectable()
export class HttpProvider implements IHttpProvider {
  private readonly logger = new Logging(HttpProvider.name);
  constructor(private readonly _serviceTracing: IServiceTracingProvider) {}

  /**
   * Operación para realizar un consumo a legados de tipo Rest
   * @param {IRequestConfigHttp} _requestConfig arreglo con información del legado a consumir
   * @param {Etask} _task nombre identificador de la tarea donde se realiza el consumo
   * @returns {ResponseHttp} arreglo con información de respuesta del legado consumido
   */
  async executeRest<R = any>(_requestConfig: IRequestConfigHttp, _task?: Etask): Promise<ResponseHttp<R>> {
    let result: ResponseHttp;
    const startTime = process.hrtime();
    try {
      let traceability = new Traceability({});
      traceability.setTransactionId(GeneralUtil.getCorrelationalId);
      traceability.setRequest(_requestConfig);
      traceability.setTask('REQUEST_CONSUMO_LEGADO_' + _task);
      traceability.setStatus(EStatusTracingGeneral.LEGACY_SUCCESS);
      this._serviceTracing.createServiceTracing(traceability.getTraceability());

      this.logger.write('Request ejecución HTTP REST', _requestConfig.url, ELevelsErrors.INFO, _requestConfig);
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
    } catch (error) {
      error['config'] = _requestConfig;
      result = new ResponseHttp(error);
    }
    const endTime = process.hrtime(startTime);
    const executionTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
    let responseTrace = {
      data: result?.data || result.message,
      status: result.status
    };

    let traceabilityRes = new Traceability({});
    traceabilityRes.setTransactionId(GeneralUtil.getCorrelationalId);
    traceabilityRes.setRequest(_requestConfig);
    traceabilityRes.setResponse(responseTrace);
    traceabilityRes.setTask('RESPONSE_CONSUMO_LEGADO_' + _task);
    traceabilityRes.setProcessingTime(executionTime);
    traceabilityRes.setStatus(traceabilityRes.getStatusTraceability(result));
    this._serviceTracing.createServiceTracing(traceabilityRes.getTraceability());

    const level: ELevelsErrors =
      result.status === 200 || result.status === 201 ? ELevelsErrors.INFO : ELevelsErrors.ERROR;
    this.logger.write(
      'Resultado ejecución HTTP REST',
      _requestConfig.url,
      level,
      _requestConfig,
      responseTrace,
      executionTime
    );

    if (!result.executed) {
      let document = {
        document: {
          source: result.requestInfo.url,
          info: result.message
        },
        codMessage: EmessageMapping.TIMEOUT
      };
      throw new BusinessException(HttpStatus.CREATED, EmessageMapping.TIMEOUT, true, document);
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
