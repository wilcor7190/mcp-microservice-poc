/**
 * Clase abstracta utilizada para realizar las respectivas operaciones de complementos de direcciones
 * @Author Sebastian Traslaviña
 */

import { Injectable } from '@nestjs/common';
import { GeographicAdDto } from '../dto/geographicAddres/geographicAddress.dto';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class IAddressComplement {
  /**
   * Firma del metodo utilizado para consultar posibles complementos de direcciones
   * @param {String} channel canal ingresado por el usuario en el header
   * @param {GeographicAdDto} geographicDto informacion relacionada a la direccion ingresada por el cliente
   * @returns {ResponseService} retorna direccion del cliente estandarizada
   */
  abstract consultAddressComplement(channel: string, geographicDto: GeographicAdDto): Promise<ResponseService<any>>; // TIPAR DEL TIPO
}
