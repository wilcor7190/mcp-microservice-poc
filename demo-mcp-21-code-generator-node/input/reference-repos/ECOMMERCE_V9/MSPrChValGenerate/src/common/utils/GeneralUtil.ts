/**
 * Clase con metodos utilitarios
 * @author alexisterzer
 */

const rTracer = require('cls-rtracer');
import { Cache } from "cache-manager";
import { IMessage } from '@claro/generic-models-library';
import { ParamUcimpl } from 'src/core/use-case/resource/impl/param.resource.uc.impl';
import generalConfig from '../configuration/general.config';
import { EtypeDocument } from "./enums/params.enum";
import { ELevelsErros } from './enums/logging.enum';
import Logging from '../lib/logging';
import { Etask, ETaskDesc } from './enums/taks.enum';
import { EStatusTracingGeneral, ETaskTracingGeneral } from './enums/tracing.enum';
import { HttpStatus } from '@nestjs/common';
import Traceability from '../lib/traceability';
const path = require("path");
const FS = require("fs");
const xml2js = require('xml2js');
export default class GeneralUtil {

  public static get getCorrelationalId(): string {
    return rTracer.id()
  }


  /**
  * Convierte data con estructura xml a objeto en formato JSON
  * @param {string} xml string con estructura xml a transformar
  * @returns JSON resultado de la transformación
  */
  public static async convertXmlToJson(xml: any): Promise<any> {
    if (GeneralUtil.validateValueRequired(xml)) {

      // return await xmlParser.xmlToJson(v, (err, json) => {
      const parser = new xml2js.Parser(
        {
          explicitArray: false,
          xmlns: false,
          attrValueProcessors: [function cleanOutput(value, name) {
            return (name.startsWith('xmlns:')) ? undefined : value;
          }],
        });

      return parser.parseStringPromise(xml).then((result) => {

        return JSON.parse(JSON.stringify(result));
      })
        .catch(function (err) {
          throw new Error(`Error transformando xml a JSON. ${err}`);
        });
    }
    else
      return null;
  }

  /**
    * Función para asignar tarea y descripción de error de manera global
    * @param {any} error arreglo con información de error
    * @param {Etask} task cadena con nombre de tarea del error
    * @param {ETaskDesc} taskDesc cadena de descripción de tarea del error
    * @returns Cadena con estado de error según respuesta
    */
  public static assignTaskError(error, task: Etask, taskDesc: ETaskDesc) {
    error.task_name = (error.task_name !== undefined) ? error.task_name : task;
    error.task_description = (error.task_description !== undefined) ? error.task_description : taskDesc;
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
   * Función para imprimir logs en el ciclo de vida del interceptor
   * @param {any} req objeto de la petición
   * @param {any} request body o params de la petición
   * @param {any} name nombre de la clase interceptor
   * @param {any} data respuesta final de la petición
   * @param {number} executionTime tiempo de execución de la respuesta
   */
  public static logRequestResponse(req, request, name, data?, executionTime?) {
    let message: string = 'Entrada';
    let level = ELevelsErros.INFO;

    if (data) {
      message = 'Salida';
      if (data.status !== 200)
        level = ELevelsErros.WARNING;
    }

    message += ` Principal - ${req.url} - ${req.method}`;

    new Logging(name).write(
      message,
      Etask.REQUEST_HTTP,
      level,
      request,
      data,
      executionTime
    );

  }

  /**
   * Función para generar estado de error según respuesta de legado
   * @param {any} result arreglo con información respuesta de legado
   * @returns Cadena con estado de error según respuesta
   */
  public static getLevelError(result: any) {
    let levelError: ELevelsErros;
    if (!result.executed) {
      levelError = ELevelsErros.ERROR;
    } else {
      levelError = (result.status === HttpStatus.OK || result.status === HttpStatus.CREATED) ? ELevelsErros.INFO : ELevelsErros.WARNING
    }
    return levelError
  }


  /**
   * Limpia los valores y/o propiedades de un JSON
   * @param {*} json objeto JSON a limpiar
   * @param {string}replaceValues Arregalo de valores a remplazar del json
   * @param {string}replaceBy caracter por el cual se reemplazaran los valores indicados.
   * @returns Objeto json con valores reemplazados
   */
  public static cleanProperties(json: any, replaceValues: string[], replaceBy: string = ''): any {
    let jsonString = JSON.stringify(json);

    replaceValues.forEach(value => {
      jsonString = jsonString.replace(new RegExp(value, 'ig'), replaceBy);
    });

    return JSON.parse(jsonString);
  }


  /**
   * Determina si el canal indicado es valido
   * @param {String} channel Canal recibido en el header de una petición api en el microservicio
   * @returns {Boolean} Resultado de validación del canal
   */
  public static validateChannel(channel: string): boolean {
    if (ParamUcimpl.params.find(p => p.id_param == channel))
      return true;
    return false;
  }


  /**
   * Transforma el tipo de documento a su homologo en número
   * @param {EtypeDocument} typeDoc caracter de Tipo de documento en string
   * @returns {Number} Número de homologación del tipo de documento
   */
  public static transformTypeDoc(typeDoc: EtypeDocument): number {
    switch (typeDoc) {
      case EtypeDocument.CC:
        return 1;
      case EtypeDocument.CE:
        return 4;
      default:
        return null;
    }
  }


  /**
  * Valida el tipo de campo de un registro
  * @param {String} value tipo de campo del valor enviado
  * @returns {String} resultado de homologación si el tipo de campo es correcto
  */
  public static validateValueRequired(value: string | number): boolean {
    if (value == undefined || value == null)
      return false;

    if (typeof value === 'number')
      return value >= 0

    if (typeof value === 'string')
      return !(value === "undefined" || value.trim().length == 0)

    return false;
  }



  /**
   * Retorna url de origen de las solicitudes recibidas por el ms
   * @param {String} url url recibida en el ms 
   * @returns {String} url de origen
   */
  public static getOrigin(url: string): string {
    return `${generalConfig.apiMapping}${(url?.includes('?')) ? url.slice(0, url.indexOf('?')) : url}`;
  }


  /**
   * Lee el archivo xml 
   * @param {*}name nombre del archivo xml 
   * @returns lectura del archivo en formato utf8
   */
  public static getTemplateXML = name => {
    const pathfile = path.resolve(`${__dirname}/xmls/${name}.xml`);
    return FS.readFileSync(pathfile, "utf8");
  }


  /**
   * Manejo de mensajes en cache
   * @param {Cache} cache cache almacenado
   * @param {string} operation tipo de operacion a realizar
   * @param {IMessage[]} messages arreglo de mensajes
   * @param {IMessage} updatedMessage mensaje actualizado
   */
  public static async cacheMessages(
    cache: Cache,
    operation: string,
    messages?: IMessage[],
    updatedMessage?: IMessage,
  ) {

    if (operation == 'update') {
      // Actualizar el mensaje en cache
      messages = await cache.get<IMessage[]>('messages');
      const messagePosition = messages.findIndex(message => message.id === updatedMessage.id);
      messages[messagePosition] = updatedMessage;
    }
    // Almacenar los mensajes en cache
    cache.set('messages', messages, generalConfig.ttlCache); // ttl (expiration time in seconds) 0 To disable expiration of the cache,
  }

  /**
   * Valida la diferencia de días entre dos fechas
   * @param {Date} date1 primera fecha a valida
   * @param {Date} date2 segunda fecha a valida
   * @returns {Number} resultado diferencia de días de las dos fechas
   */
  public static validateDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    const d1 = new Date(date1); const d2 = new Date(date2);

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

  public static getCsv = name => {
    return path.resolve(`${__dirname}/${name}.csv`);

  }

  /**
   * Valida si la data es indefinida o nula
   * @param data data recibida
   * @returns data
   */
  public static validateData = data => {
    if (data === undefined || data === null || data === "N/A" || data === "n/a") {
      data = 0
      return data
    }
    return parseFloat(data.replace(/,/g, '.'))
  }

  /**
     * Función para guardar la trazabilidad en el ciclo de vida del interceptor
     * @param {any} req objeto de la petición
     * @param {any} request body o params de la petición
     * @param {any} data respuesta final de la petición
     * @param {number} executionTime tiempo de execución de la respuesta
     */
  public static traceabilityInterceptor(req, request, data?, executionTime?) {
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
      if (data.status !== 200)
        status = EStatusTracingGeneral.STATUS_FAILED;
    }

    traceability.setTask(task);
    traceability.setStatus(status);
    return traceability;
  }

}


