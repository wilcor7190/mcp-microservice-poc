/**
 * Clase que escribe logs en la consola del microservicio
 * @author Frank Morales
 */

const info = require('../../../package.json');
import util from '../utils/generalUtil';
import { logger, logOutput } from '@claro/logging-library';
import generalConfig from '../configuration/general.config';
import { ELevelsErrors, ELevelsErrorsGlobal } from '../utils/enums/logging.enum';

export default class Logging {
  private readonly LOG_LEVEL = generalConfig.logLevel;
  private readonly context: string;

  constructor(context: string) {
    this.context = context;
  }

  /**
   * Escribe traza informativa en la consola del pod
   * @param {String} message mensaje informativo
   * @param {ETask} taks nombre de la tarea que ejecuta el proceso
   * @param {String} level nivel del log informativo
   * @param {Object} request Objeto que se envia al consumo de un legado o request recibido de una petición api
   * @param {Object} response Objeto de respuesta que retorna el consumo de un legado o respuesta de una petición api
   * @param {Number} processingTime Tiempo en milisegundos donde se registra el tiempo de procesamiento de la operación
   */
  public write(message: string, taks: any, level: ELevelsErrors = ELevelsErrors.INFO, request?: any, response?: any, processingTime?: number) {
    const LEVEL = level.toUpperCase();
    if (
      this.LOG_LEVEL === ELevelsErrorsGlobal.ALL ||
      this.LOG_LEVEL === ELevelsErrorsGlobal.INFO ||
      (this.LOG_LEVEL === ELevelsErrorsGlobal.WARNING && LEVEL !== ELevelsErrorsGlobal.INFO) ||
      (this.LOG_LEVEL === ELevelsErrorsGlobal.ERROR && LEVEL === ELevelsErrorsGlobal.ERROR)
    ) {
      logger.log(logOutput(info.name, `${this.context || ''} - ${taks || ''}`, util.getCorrelationalId, message, level, request, response, processingTime));
    }
  }
}
