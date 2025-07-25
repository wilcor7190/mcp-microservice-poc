/**
 * Clase con metodos utilitarios como transformacion de data
 * @author Oscar Alvarez
 */
const rTracer = require('cls-rtracer');
import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import generalConfig from '../configuration/general.config';
import { EStatusTracingGeneral, ETaskTracingGeneral } from './enums/tracing.enum';
import Traceability  from '../lib/traceability';
import Logging from '../lib/logging';
import { ETaskDesc, Etask } from './enums/task.enum';
import { ELevelsErrors } from './enums/logging.enum';
import * as xml2js from 'xml2js';
import { HttpStatus } from '@nestjs/common';
import { IServiceTracing } from 'src/core/entity/service-tracing/service-tracing.entity';
import { EmessageMapping } from './enums/message.enum';
import { MessageUcimpl } from 'src/core/use-case/impl/message.uc.impl';
import { GlobalStorageUtil, IMessage, IParam } from '@claro/generic-models-library';
import { EIdParam } from './enums/params.enum';

export default class GeneralUtil {
  public static get getCorrelationalId(): string {
    return rTracer.id() || '';
  }

  /**
   * Función para validar que request envia el usuario en una petición API
   * @param {any} obj arreglo con información recibida de la API
   * @returns Boolean si existe información
   */
  public static isEmptyObject(obj: any) {
    return Object.getOwnPropertyNames(obj).length !== 0;
  }

  /**
   * Convierte data con estructura xml a objeto en formato JSON
   * @param {Any} xml string con estructura xml a transformar
   * @returns JSON resultado de la transformación
   */
  public static async convertXmlToJson(xml: any): Promise<any> {
    if (GeneralUtil.validateValueRequired(xml)) {
      const parser = new xml2js.Parser({
        explicitArray: false,
        xmlns: false,
        attrValueProcessors: [
          function cleanOutput(value, name) {
            return name.startsWith('xmlns:') ? undefined : value;
          },
        ],
      });
      return parser
        .parseStringPromise(xml)
        .then((result) => {
          return JSON.parse(JSON.stringify(result));
        })
        .catch((err) => {
          new Logging(GeneralUtil.name).write('Error transformando xml a JSON', Etask.XML_TO_JSON, ELevelsErrors.WARNING, xml, err);
          throw new Error(`Error transformando xml a JSON. ${err}`);
        });
    } else return null;
  }

    /**
   * Consulta el nombre del mensaje por su identificador
   * @param {EmessageMapping} idMessage parametro a buscar en el mensaje
   * @returns valor del nombre del mensaje consultado
   */
    public static mappingMessage(idMessage: EmessageMapping): string {
      return MessageUcimpl.getMessages.find(m => m.id == idMessage)?.message;
    }

  /**
   * Determina si el canal indicado es valido
   * @param channel
   * @returns un booleano
   */
  public static validateChannel(channel: string): boolean {
    if (ParamUcimpl.params.find((param) => param.id_param == 'CHANNEL' && param.values.find((value) => value == channel))) {
      return true;
    }
    return false;
  }

  /**
   * Valida el tipo de campo de un registro
   * @param {String} value tipo de campo del valor enviado
   * @returns {String} resultado de homologación si el tipo de campo es correcto
   */
  public static validateValueRequired(value: string | number): boolean {
    if (value == undefined || value == null) return false;

    if (typeof value === 'number') return value >= 0;

    if (typeof value === 'string') return !(value === 'undefined' || value.trim().length == 0);

    return false;
  }

  /**
   * Retorna url de origen de las solicitudes recibidas por el ms
   * @param {String} url url recibida en el ms
   * @returns {String} url de origen
   */
  public static getOrigin(url: string): string {
    return `${generalConfig.apiMapping}${url?.includes('?') ? url.slice(0, url.indexOf('?')) : url}`;
  }

  /**
   * Compara y hace distintas operaciones entre fechas
   * @param {Date} date1  Fecha para comparar
   * @param {Date} date2 Fecha para comparar
   * @returns diferencia en tiempo
   */
  public static validateDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Check if the dates are equal
    const same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;

    // Check if the first is less than second
    if (d1 < d2) return -1;

    // To calculate the time difference of two dates
    const Difference_In_Time = d2.getTime() - d1.getTime();

    // To calculate the no. of days between two dates
    return Difference_In_Time / (1000 * 3600 * 24);
  }

  /**
   * Mapeo de especificacion de direcciones
   * @param {Array} alternateGeographicAddress Informacion de direcciones
   * @param {Array} fillAlternate array con informacion por defecto a depositar
   * @returns un objeto mapeado con la informacion relacionada a direcciones
   */
  public static mapAlternateGeographics(alternateGeographicAddress: any, fillAlternate: any) {
    return {
      pi_mz_tipo_nivel1: alternateGeographicAddress?.nivel1Type ? alternateGeographicAddress.nivel1Type : fillAlternate[0],
      pi_mz_valor_nivel1: alternateGeographicAddress?.nivel1Value ? alternateGeographicAddress.nivel1Value : fillAlternate[0],
      pi_mz_tipo_nivel2: alternateGeographicAddress?.nivel2Type ? alternateGeographicAddress.nivel2Type : fillAlternate[1],
      pi_mz_valor_nivel2: alternateGeographicAddress?.nivel2Value ? alternateGeographicAddress.nivel2Value : fillAlternate[1],
      pi_mz_tipo_nivel3: alternateGeographicAddress?.nivel3Type ? alternateGeographicAddress.nivel3Type : fillAlternate[2],
      pi_mz_valor_nivel3: alternateGeographicAddress?.nivel3Value ? alternateGeographicAddress.nivel3Value : fillAlternate[2],
      pi_mz_tipo_nivel4: alternateGeographicAddress?.nivel4Type ? alternateGeographicAddress.nivel4Type : fillAlternate[3],
      pi_mz_valor_nivel4: alternateGeographicAddress?.nivel4Value ? alternateGeographicAddress.nivel4Value : fillAlternate[3],
      pi_mz_tipo_nivel5: alternateGeographicAddress?.nivel5Type ? alternateGeographicAddress.nivel5Type : fillAlternate[4],
      pi_mz_valor_nivel5: alternateGeographicAddress?.nivel5Value ? alternateGeographicAddress.nivel5Value : fillAlternate[4],
      pi_mz_tipo_nivel6: alternateGeographicAddress?.nivel6Type ? alternateGeographicAddress.nivel6Type : fillAlternate[5],
      pi_mz_valor_nivel6: alternateGeographicAddress?.nivel6Value ? alternateGeographicAddress.nivel6Value : fillAlternate[5],
    };
  }

  /**
   * Mapeo de especificacion de complementos de direcciones
   * @param {Array} complements Informacion de complementos direcciones
   * @param {Array} fillComplements array con informacion por defecto a depositar
   * @returns un objeto mapeado con la informacion relacionada a complementos de direcciones
   */
  public static mapComplements(complements, fillComplements) {
    return {
      PI_CP_NIVEL_NIVEL1: complements?.nivel1Type ? complements.nivel1Type : fillComplements[0],
      pi_cp_valor_nivel1: complements?.nivel1Value ? complements.nivel1Value : fillComplements[0],
      PI_CP_NIVEL_NIVEL2: complements?.nivel2Type ? complements.nivel2Type : fillComplements[1],
      pi_cp_valor_nivel2: complements?.nivel2Value ? complements.nivel2Value : fillComplements[1],
      PI_CP_NIVEL_NIVEL3: complements?.nivel3Type ? complements.nivel3Type : fillComplements[2],
      pi_cp_valor_nivel3: complements?.nivel3Value ? complements.nivel3Value : fillComplements[2],
      PI_CP_NIVEL_NIVEL4: complements?.nivel4Type ? complements.nivel4Type : fillComplements[3],
      pi_cp_valor_nivel4: complements?.nivel4Value ? complements.nivel4Value : fillComplements[3],
      PI_CP_NIVEL_NIVEL5: complements?.nivel5Type ? complements.nivel5Type : fillComplements[4],
      pi_cp_valor_nivel5: complements?.nivel5Value ? complements.nivel5Value : fillComplements[4],
      PI_CP_NIVEL_NIVEL6: complements?.nivel6Type ? complements.nivel6Type : fillComplements[5],
      pi_cp_valor_nivel6: complements?.nivel6Value ? complements.nivel6Value : fillComplements[5],
    };
  }

  /**
   * Función para guardar la trazabilidad en el ciclo de vida del interceptor
   * @param {any} req objeto de la petición
   * @param {any} request body o params de la petición
   * @param {any} data respuesta final de la petición
   * @param {number} executionTime tiempo de execución de la respuesta
   */
  public static traceabilityInterceptor(req: any, request: any, data?: any, executionTime?: number) {
    let task = ETaskTracingGeneral.INICIO_REQUEST;
    let status = EStatusTracingGeneral.STATUS_SUCCESS;
    let traceability = new Traceability({});
    traceability.setTransactionId(this.getCorrelationalId);
    traceability.setOrigen(req.url);
    traceability.setRequest(request);
    traceability.setMethod(req.method);
    if (data) {
      traceability.setResponse(data);
      traceability.setProcessingTime(executionTime);
      task = ETaskTracingGeneral.FINAL_REQUEST;
      if (data.status !== 200) status = EStatusTracingGeneral.STATUS_FAILED;
    }
    traceability.setTask(task);
    traceability.setStatus(status);
    return traceability;
  }

  /**
   * Función para imprimir logs en el ciclo de vida del interceptor
   * @param {any} req objeto de la petición
   * @param {any} request body o params de la petición
   * @param {any} name nombre de la clase interceptor
   * @param {any} data respuesta final de la petición
   * @param {number} executionTime tiempo de execución de la respuesta
   */
  public static logRequestResponse(req: any, request: any, name: any, data?: any, executionTime?: number) {
    let message: string = 'Entrada';
    let level = ELevelsErrors.INFO;
    if (data) {
      message = 'Salida';
      if (data.status !== 200) level = ELevelsErrors.WARNING;
    }
    message += ` Principal - ${req.url} - ${req.method}`;
    new Logging(name).write(message, Etask.REQUEST_HTTP, level, request, data, executionTime);
  }

  /**
   * Función para generar estado de error según respuesta de legado
   * @param {any} result arreglo con información respuesta de legado
   * @returns Cadena con estado de error según respuesta
   */
  public static getLevelError(result: any) {
    let levelError: ELevelsErrors;
    if (!result.executed) {
      levelError = ELevelsErrors.ERROR;
    } else {
      levelError = result.status === HttpStatus.OK || result.status === HttpStatus.CREATED ? ELevelsErrors.INFO : ELevelsErrors.WARNING;
    }
    return levelError;
  }
  /**
   * Funcion para generar la trazabilidad en un consumo de legado
   * @param task Tarea a ejecutar por el legado
   * @param request Parametros de la petición
   * @param data Respuesta del legado
   * @param executionTime Tiempo de ejecución del legado
   * @returns
   */
  public static traceabilityForLegacy(task: string, request: any, data?: any, executionTime?: number): IServiceTracing {
    let _task = `REQUEST_CONSUMO_LEGADO_${task}`;
    let status = EStatusTracingGeneral.LEGACY_SUCCESS;
    let traceability = new Traceability({});
    traceability.setTransactionId(this.getCorrelationalId);
    traceability.setRequest(request);
    if (executionTime) {
      traceability.setResponse(data);
      traceability.setProcessingTime(executionTime);
      _task = `RESPONSE_CONSUMO_LEGADO_${task}`;
      if (data?.status !== 200 && data?.po_codigo !== 0) status = EStatusTracingGeneral.LEGACY_ERROR;
    }
    traceability.setTask(_task);
    traceability.setStatus(status);
    return traceability.getTraceability();
  }

  /**
   * Función para asignar tarea y descripción de error de manera global
   * @param {any} error arreglo con información de error
   * @param {Etask} task cadena con nombre de tarea del error
   * @param {ETaskDesc} taskDesc cadena de descripción de tarea del error
   * @returns Cadena con estado de error según respuesta
   */
  public static assignTaskError(error: any, task: Etask, taskDesc: ETaskDesc): void {
    error.task_name = error.task_name !== undefined ? error.task_name : task;
    error.task_description = error.task_description !== undefined ? error.task_description : taskDesc;
  }

  /**
   * Funcion para generar la trazabilidad en una interaccion con la base de datos Mongo
   * @param request Parametros de petición
   * @param task Tarea a ejecutar por la base de datos
   * @param response Resultado de la ejecución en la base de datos
   * @param processingTime Tiempo de ejecución
   * @returns {IServiceTracing} Modelo de trazabilidad creado
   */
  public static traceabilityForMongoDB(request: any, task: Etask, response?: any, processingTime?: number): IServiceTracing {
    let traceability = new Traceability({});
    traceability.setTransactionId(this.getCorrelationalId);
    traceability.setRequest(request);
    traceability.setStatus(EStatusTracingGeneral.BD_SUCCESS);
    if (processingTime) {
      traceability.setTask(`RESPONSE_${task}`);
      traceability.setResponse(response);
      traceability.setProcessingTime(processingTime);
    } else traceability.setTask(`REQUEST_${task}`);
    return traceability.getTraceability();
  }

  /**
   * Funcion para generar la trazabilidad para la ejecución de un CRON-JOB
   * @param request Parametros de petición
   * @param task Tarea a ejecutar por la base de datos
   * @param response Resultado de la ejecución en la base de datos
   * @param processingTime Tiempo de ejecución
   * @returns {IServiceTracing} Modelo de trazabilidad creado
   */
  public static traceabilityForCronJob(task: Etask, processingTime?: number): IServiceTracing {
    let traceability = new Traceability({});
    traceability.setTransactionId(this.getCorrelationalId);
    traceability.setStatus(EStatusTracingGeneral.BD_SUCCESS);
    if (processingTime) {
      traceability.setTask(`END_JOB_${task}`);
      traceability.setProcessingTime(processingTime);
    } else traceability.setTask(`START_JOB_${task}`);
    return traceability.getTraceability();
  }

  /**
   * Funcion para seleccionar el mensaje global de error dependiendo del codigo de respuesta (consumos OracleDB)
   * @param code codigo de error
   * @returns {EmessageMapping}
   */
  public static assignGlobalMessageErrorByCode(code: number): EmessageMapping {
    switch (code) {
      case 1:
      case 2:
        return EmessageMapping.DEFAULT;
      default:
        return EmessageMapping.DEFAULT_ERROR;
    }
  }

  /**
   * Funcion para seleccionar el mensaje de error dependiendo del codigo de respuesta (consumos OracleDB)
   * @param code codigo de error
   * @returns {EmessageMapping}
   */
  public static assignDetailMessageErrorByCode(code: number): EmessageMapping {
    switch (code) {
      case -1:
        return EmessageMapping.ERROR_TIMEOUT_INESTABILIDAD_SP;
      case 1:
        return EmessageMapping.ERROR_DIREC_NO_ENCONTRADA;
      case 2:
        return EmessageMapping.ERROR_DIRECCION_SIN_HHPP;
      default:
        return EmessageMapping.DEFAULT_ERROR;
    }
  }

  /**
   * Funcion para remplazar valores indefinidos por un string
   * @param value Valor a validar
   * @param replaceWith Valor a reemplazar
   * @returns {string}
   */
  public static repleceWhenUndefined(value: any, replaceWith: string): string {
    return value || replaceWith;
  }

  /**
   * Consulta el global storage de mensajes y obtiene el mensaje por id y canal (opcional), en caso de no ser
   * encontrado, regresará el valor de `idMessage`.
   * @param {string | EmessageMapping} idMessage Identificador del mensaje
   * @param {string} channel Canal de la petición
   * @returns {string}
   */
  public static getMessage(idMessage: string | EmessageMapping, channel?: string): string {
    if (!channel)
      return (
        GlobalStorageUtil.messages.find((ms: IMessage) => ms.id === idMessage)
          ?.message || idMessage
      );
    const message = GlobalStorageUtil.messages.find((ms) => ms.id === idMessage && ms.channel.includes(channel));
    if (!message)
      new Logging(GeneralUtil.name).write(
        `Mensaje ${idMessage} no configurado para el canal ${channel}.`,
        Etask.FINDONE,
        ELevelsErrors.WARNING,
      );
    return message?.message || idMessage;
  }

  /**
   * Consulta el global storage de parámetros y obtiene el campo values de este parámetro, en caso de
   * no encontrarlo retornará `undefined`.
   * @param {EIdParam} idParam Identificador del mensaje
   * @param {string} channel Canal de la petición
   * @returns {T}
   */
  public static getParam<T = any>(idParam: EIdParam, channel?: string): T {
    if (channel)
      return GlobalStorageUtil.params.find(
        (param: IParam<T>) => param.id_param === idParam && param.channel.includes(channel),
      )?.values;
    return GlobalStorageUtil.params.find((param: IParam<T>) => param.id_param === idParam)?.values;
  }
}
