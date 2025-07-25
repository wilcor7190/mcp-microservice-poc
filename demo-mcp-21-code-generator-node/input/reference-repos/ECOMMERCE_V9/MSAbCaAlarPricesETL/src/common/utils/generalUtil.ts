const rTracer = require('cls-rtracer');
const path = require('path');
const FS = require('fs');
import generalConfig from '../configuration/general.config';
import { BusinessException } from '../lib/business-exceptions';
import { EmessageMapping } from './enums/message.enum';
import { Cache } from 'cache-manager';
import * as moment from 'moment';
import { MappingStatusCode } from '../configuration/mapping-statuscode';
import { EtypeDocument } from './enums/params.enum';
import { Etask } from './enums/taks.enum';
import Logging from '../lib/logging';
import { MessageUcimpl } from '../../core/use-case/impl/message.uc.impl';
import { ELevelsErros } from './enums/logging.enum';
import { IMessage } from '@claro/generic-models-library';
const xml2js = require('xml2js');
export default class GeneralUtil {

  public static get getCorrelationalId(): string {
    return rTracer.id() || '';
  }

  /**
   * Convierte data con estructura xml a objeto en formato JSON
   * @param xml string con estructura xml a transformar
   * @returns JSON resultado de la transformación
   */
  public static async convertXmlToJson(xml: any): Promise<any> {
    if (GeneralUtil.validateValueRequired(xml)) {
      // return await xmlParser.xmlToJson(v, (err, json) => {
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
          new Logging(GeneralUtil.name).write(
            'Result JSON transform from XML =>  ' + JSON.stringify(result),
            Etask.VALIDATE_REQUEST,
          );
          return JSON.parse(JSON.stringify(result));
        })
        .catch(function (err) {
          new Logging(GeneralUtil.name).write(
            'Error transformando xml a json.' + JSON.stringify(err),
            Etask.VALIDATE_REQUEST,
            ELevelsErros.WARNING,
          );
          throw new Error(`Error transformando xml a JSON. ${err}`);
        });
    } else return null;
  }

  /**
   * Limpia los valores y/o propiedades de un JSON
   * @param json objeto JSON a limpiar
   * @param replaceValues Arregalo de valores a remplazar del json
   * @param replaceBy caracter por el cual se reemplazaran los valores indicados.
   * @returns Objeto json con valores reemplazados
   */
  public static cleanProperties(
    json: any,
    replaceValues: string[],
    replaceBy: string = '',
  ): any {
    let jsonString = JSON.stringify(json);

    replaceValues.forEach((value) => {
      jsonString = jsonString.replace(new RegExp(value, 'ig'), replaceBy);
    });

    return JSON.parse(jsonString);
  }

  /**
   * Función para generar log informativo para el services provider de Message
   * @param {any} startTime cadena fecha inicio consulta bd
   */
  public static processExecutionTime(startTime: any): number {
    const endTime = process.hrtime(startTime);
    return Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
  }

  /**
   * Transforma el tipo de documento a su homologo en número
   * @param typeDoc
   * @returns
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
   *
   * @param value
   * @returns
   */
  public static validateValueRequired(value: string | number): boolean {
    if (value == undefined || value == null) return false;

    if (typeof value === 'number') return value >= 0;

    if (typeof value === 'string')
      return !(value === 'undefined' || value.trim().length == 0);

    return false;
  }

  /**
   * Retorna url de origen de las solicitudes recibidas por el ms
   * @param url
   * @returns
   */
  public static getOrigin(url: string): string {
    return `${generalConfig.apiMapping}${
      url?.includes('?') ? url.slice(0, url.indexOf('?')) : url
    }`;
  }

  public static getTemplateXML = (name) => {
    const pathfile = path.resolve(`${__dirname}/xmls/${name}.xml`);
    return FS.readFileSync(pathfile, 'utf8');
  };

  /**
   * Manejo de mensajes en cache
   * @param cache
   * @param operation
   * @param messages
   * @param updatedMessage
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
      const messagePosition = messages.findIndex(
        (message) => message.id === updatedMessage.id,
      );
      messages[messagePosition] = updatedMessage;
    }
    // Almacenar los mensajes en cache
    cache.set('messages', messages, generalConfig.ttlCache); // ttl (expiration time in seconds) 0 To disable expiration of the cache
  }

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

  public static getDateUTC() {
    return moment().format();
  }

  public static generateBusinessException(
    document: any,
    message: EmessageMapping,
    status: MappingStatusCode,
    success: boolean,
  ) {
    throw new BusinessException(status, message, success, {
      document: { orders: document },
    });
  }

  /**
   * Valida si la variable recibida es de valor true o false
   * @param value
   * @returns boolean
   */

  public static validateBoolean(value: boolean): boolean {
    if (value !== true) return false;

    return true;
  }

  /**
   * Valida si la variable recibida contiene el mismo valor que el string recibido
   * @param element
   * @param sentence
   * @returns boolean
   */

  public static validateValueAndString(
    element: string,
    sentence: string,
  ): boolean {
    if (element !== sentence) return false;

    return true;
  }

  public static ifExist(element: any): any {
    if (element) return element;
    return '';
  }

  /**
   * Función para validar si "value" es empty
   * @param {*} value
   * @return true o false
   */
  public static isEmpty(value) {
    return this.isUndefined(value) ||
      (value === '' && typeof value === 'string') ||
      (typeof value === 'object' && Object.keys(value).length == 0)
      ? true
      : false;
  }

  /**
   * Función para validar si "value" es undefined
   * @param {*} value
   * @return true o false
   */
  public static isUndefined(value) {
    return (value === undefined && typeof value === 'undefined') ||
      (value === 'undefined' && typeof value === 'string')
      ? true
      : false;
  }

  /**
   * Función para validar si "value" es null
   * @param {*} value
   * @return true o false
   */
  public static isNull(value) {
    return (value === null && typeof value === 'object') ||
      (value === 'null' && typeof value === 'string')
      ? true
      : false;
  }
  /**
   * Función para validar si "value" es null, undefined o vacío
   * La validación toma en cuenta si el null y el undefined
   * son object o string.
   * @param {*} value valor de entrada
   * @return true o false
   */
  public static isNullOrEmpty(value) {
    return this.isNull(value) || this.isEmpty(value) ? true : false;
  }

  public static isPricesInCop(element) {
    return element ?? '0';
  }

  /**
   * Consulta el nombre del mensaje por su identificador
   * @param {EmessageMapping} idMessage parametro a buscar en el mensaje
   * @returns valor del nombre del mensaje consultado
   */
  public static mappingMessage(idMessage: EmessageMapping): string {
    return MessageUcimpl.getMessages.find((m) => m.id == idMessage)?.message;
  }
}
