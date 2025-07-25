/**
 * Clase con metodos utilitarios como transformacion de data
 * @author Fredy Santiago Martinez
 */
const rTracer = require('cls-rtracer');
const path = require("path");
const FS = require("fs");
import { BusinessException } from '../lib/business-exceptions';
import { EmessageMapping } from './enums/message.enum';
import { ParamUcimpl } from 'src/core/use-case/resource/impl/param.resource.uc.impl';
import * as moment from 'moment';
import { MappingStatusCode } from '../configuration/mapping-statuscode';
import { EtypeDocument } from './enums/params.enum';
import { Etask, ETaskDesc } from './enums/taks.enum';
import Logging from '../lib/logging';
import { ELevelsErros } from './enums/logging.enum';
import { HttpStatus } from '@nestjs/common';
import { EStatusTracingGeneral, ETaskTracingGeneral } from './enums/tracing.enum';
import Traceability from '../lib/traceability';


const xml2js = require('xml2js');
export default class GeneralUtil {

  public static get getCorrelationalId(): string {
    return rTracer.id() || '';
  }


  /**
  * Valida si el canal recibido en el microservicio es correcto
  * @param {String} channel Canal recibido en el header de una petición api en el microservicio
  * @returns {Boolean} Resultado de validación del canal
  */
  public static validateChannel(channel: string): boolean {
    if (ParamUcimpl.params.find(param => param.id_param == "CHANNEL" && param.values.find((value) => value == channel)))
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
   * Lee el archivo xml 
   * @param {*}name nombre del archivo xml 
   * @returns lectura del archivo en formato utf8
   */
  public static getTemplateXML = name => {
    const pathfile = path.resolve(`${__dirname}/xmls/${name}.xml`);
    return FS.readFileSync(pathfile, "utf8");
  };


  /**
   * Obtiene la fecha y hora actual
   * @returns La fecha y hora cuando se ejecuta
   */
  public static getDateUTC() {
    return moment().format();
  }

  /**
   * Genera excepciones de negocio 
   * @param {*} document 
   * @param {EmessageMapping} message tipo de excepcion
   * @param {MappingStatusCode} status estado de la excepcion
   * @param {boolean} success  estado de la operacion 
   */
  public static generateBusinessException(document: any, message: EmessageMapping, status: MappingStatusCode, success: boolean) {
    throw new BusinessException(
      status,
      message,
      success,
      { document: { orders: document } }
    );
  }

  /**
   * Valida si la variable recibida es de valor true o false
   * @param {boolean} value Valor recibido
   * @returns {boolean} true o false
   */
  public static validateBoolean(value: boolean): boolean {
    if (value !== true)
      return false
    return true
  }

  /**
  * Valida si la variable recibida contiene el mismo valor que el string recibido
  * @param {string} element Valor recibido
  * @param {string} sentence Valor recibido
  * @returns {boolean} true o false
  */
  public static validateValueAndString(element: string, sentence: string): boolean {
    if (element !== sentence)
      return false

    return true
  }

  /**
   * Valida si la variable recibida existe 
   * @param {*}element elemento recibido
   * @returns el elemento o vacio
   */
  public static ifExist(element: any): any {
    if (element)
      return element
    return ''
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
      levelError = (result.status === HttpStatus.OK  || result.status === HttpStatus.CREATED) ? ELevelsErros.INFO : ELevelsErros.WARNING
    }
    return levelError
  }

  /**
   * Función para asignar tarea y descripción de error de manera global
   * @param {any} error arreglo con información de error
   * @param {Etask} task cadena con nombre de tarea del error
   * @param {ETaskDesc} taskDesc cadena de descripción de tarea del error
   * @returns Cadena con estado de error según respuesta
   */
  public static assignTaskError(error, task:Etask, taskDesc:ETaskDesc){
    error.task_name = (error.task_name !== undefined) ? error.task_name : task;
    error.task_description = (error.task_description !== undefined) ? error.task_description : taskDesc;
  }

  /**
   * Función para imprimir logs en el ciclo de vida del interceptor
   * @param {any} req objeto de la petición
   * @param {any} request body o params de la petición
   * @param {any} name nombre de la clase interceptor
   * @param {any} data respuesta final de la petición
   * @param {number} executionTime tiempo de execución de la respuesta
   */
  public static logRequestResponse( req, request, name, data?, executionTime? ){
    let message: string = 'Entrada';
    let level = ELevelsErros.INFO;
    
    if(data) {
      message = 'Salida';
      if (data.status !== 200 )
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
   * Función para guardar la trazabilidad en el ciclo de vida del interceptor
   * @param {any} req objeto de la petición
   * @param {any} request body o params de la petición
   * @param {any} data respuesta final de la petición
   * @param {number} executionTime tiempo de execución de la respuesta
   */
  public static traceabilityInterceptor( req, request, data?, executionTime? ){
    let task = ETaskTracingGeneral.INICIO_REQUEST;
    let status = EStatusTracingGeneral.STATUS_SUCCESS;
    
    let traceability = new Traceability({});
    traceability.setTransactionId(this.getCorrelationalId);
    traceability.setOrigen(req.url);
    traceability.setRequest(request);
    traceability.setMethod(req.method);

    if(data){
      traceability.setResponse(data);
      traceability.setProcessingTime(executionTime);
      task = ETaskTracingGeneral.FINAL_REQUEST;
      if (data.status !== 200 )
        status = EStatusTracingGeneral.STATUS_FAILED;
    }

    traceability.setTask(task);
    traceability.setStatus(status);
    return traceability;
  }

}


