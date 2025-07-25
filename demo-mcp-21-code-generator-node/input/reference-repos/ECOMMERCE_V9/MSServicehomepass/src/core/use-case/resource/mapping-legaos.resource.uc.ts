/**
 * Clase abstracta para almacenar las firmas de los metodos que consumen legados REST
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IMappingLegadosUc {
  /**
   * Firma del metodo que se utiliza para consumir un legado REST
   * @param {any} traceInfo Request a utilizar
   * @param {string} endPoint Legado a consumir
   */
  abstract consumerLegadoRest(traceInfo: any, endPoint: string): Promise<any>;

  /**
   * Firma del metodo que se utiliza para consumir un legado REST que se usa en el JOB
   * @param {any} traceInfo Request a utilizar
   * @param {string} endPoint Legado a consumir
   */
  abstract consumerLegadoRestJOB(traceInfo: any, endPoint: string): Promise<any>;

  /**
   * Firma del metodo que se utiliza para consumir un legado REST POST
   * @param {any} traceInfo Request a utilizar
   * @param {string} endPoint Legado a consumir
   */
  abstract consumerLegadoRestPost(traceInfo: any, endPoint: string): Promise<any>;
}
