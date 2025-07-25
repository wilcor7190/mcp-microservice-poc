/**
 * Clase abstracta que almacena los metodos para gestion de registro de errores directamente en BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { IServiceError } from '@claro/generic-models-library';

@Injectable()
export abstract class IServiceErrorProvider {
  /**
   * Firma del metodo para crear registros de errores
   * @param {any} error registro de error a crear
   * @param {ITaskError} task tarea que se estaba ejecutando cuando surgió el error
   */
  abstract createServiceError(ServiceErrors: IServiceError);

}
