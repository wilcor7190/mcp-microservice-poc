/**
 * Obtiene la configuracion para el manejo de errores
 * @author Angie Pinilla
 */
import { Injectable } from '@nestjs/common';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';


@Injectable()
export abstract class IGetErrorTracingUc {

    /**
   * Funcion para registrar los errores
   * @param {any} error error capturado
   * @param {any}request
   */
    abstract getError(error: any, request?: any);

    /**
  * Funcion para registrar la trazabilidad
  * @param {EStatusTracingGeneral} status Estado de la trazabilidad
  * @param {EDescriptionTracingGeneral}description Descripcion de la tarea
  * @param {ETaskTracingGeneral}task Nombre de la tarea
  */
    abstract createTraceability( status: EStatusTracingGeneral, description: EDescriptionTracingGeneral | string, task: ETaskTracingGeneral
    )


}