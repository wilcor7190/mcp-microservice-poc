/**
 * Clase abstracta para realizar la orquestación de dataload por eventos
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IEventsService {

  /**
   * Operación para orquestar la creación del dataload
   * 
   * @param {String} family Familia para filtrar los dataloads a generar
   */
  abstract orchDataloadKafka(family: string);
}