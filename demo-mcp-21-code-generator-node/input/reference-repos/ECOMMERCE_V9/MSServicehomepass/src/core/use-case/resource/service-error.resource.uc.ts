/**
 * Clase abstracta que almacena los metodos para gestion de registro de errores
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import { IServiceTracingInitial, ITaskError } from '@claro/generic-models-library';

@Injectable()
export abstract class IServiceErrorUc {
  /**
   * Lógica creación errores en los ms
   * @param {Object} error arreglo información de error
   * @param {ITaskError} task Identificador de la tarea donde se genero el error
   * @param {Object} request arreglo información adicional donde se genero el error
   * @param {ELevelsErros} nivel cadena del nivel del error
   */
  abstract createServiceError(error: any, task: ITaskError, request?: any, tracingInfoPrincipal?: IServiceTracingInitial, nivel?: ELevelsErrors): void;
}
