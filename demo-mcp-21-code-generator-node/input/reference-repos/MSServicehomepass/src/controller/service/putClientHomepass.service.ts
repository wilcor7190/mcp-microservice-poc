/**
 * Clase abstracta para realizar las respectivas operaciones de consulta de clientes con ordenes de servicio
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { CLienthomepassDto } from '../dto/clienthomepass/clienthomepass.dto';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class IPutClientHomepass {
  /**
   * Firma del metodo que se utiliza para validar la cobertura de red de la dirección de un cliente.
   * @param {string} channel
   * @param {CLienthomepassDto} cLienthomepassDto
   */
  abstract consultPutClientHomepass(channel: string, cLienthomepassDto: CLienthomepassDto): Promise<ResponseService<any>>; // TIPAR DEL TIPO
}
