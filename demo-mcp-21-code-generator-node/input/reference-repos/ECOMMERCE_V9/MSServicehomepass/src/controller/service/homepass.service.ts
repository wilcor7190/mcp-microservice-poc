/**
 * Clase abstracta para realizar las respectivas operaciones de consultas e instalacion de servicios en hogares
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { HomePassDTO } from '../dto/hompass/hompass.dto';

@Injectable()
export abstract class IHomePassService {
  /**
   * Firma del metodo utilizado para validar la cobertura de red de la dirección de un cliente.
   * @param {string} channel Canal ingresado por el usuario en el header
   * @param {HomePassDTO} homePassDTO Informacion ingresada por el usuario para validar cobertura
   */
  abstract consultHomePass(HomePassDTO: HomePassDTO, channel: string): any;
}
