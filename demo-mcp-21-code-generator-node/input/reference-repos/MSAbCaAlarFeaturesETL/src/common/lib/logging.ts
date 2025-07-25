/**
 * Clase que escribe logs en la consola del microservicio
 * @author Frank Morales
 */

const info = require('../../../package.json');
import util from "../utils/GeneralUtil";
import { logger, logOutput, levelsErros } from '@claro/logging-library';
import generalConfig from "../configuration/general.config";

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
     * @param {Boolean} isError true si es un log de error, o false si es un log informativo
     * @param {Object} request Objeto que se envia al consumo de un legado o request recibido de una petición api
     * @param {Object} response Objeto de respuesta que retorna el consumo de un legado o respuesta de una petición api
     * @param {Number} processingTime Tiempo en milisegundos donde se registra el tiempo de procesamiento de la operación
     */
    public write(message: string, taks: any, isError: boolean = false, request?: any, response?: any, processingTime?: number) {
        if (this.LOG_LEVEL === 'ALL' || (this.LOG_LEVEL == 'ERROR' && isError))
            logger.log(logOutput(info.name, `${this.context || ''} - ${taks || ''}`, util.getCorrelationalId,
                message,
                isError ? levelsErros.ERROR : levelsErros.INFO, request, response, processingTime));
    }

}