/**
 * Clase abstracta para realizar las respectivas operaciones de consulta de clientes con ordenes de servicio directo a BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { CLienthomepassDto } from '../../../controller/dto/clienthomepass/clienthomepass.dto';

@Injectable()
export abstract class IPutClientHomePass {
  /**
   * Firma del metodo que se utiliza para solicitar la informacion de cobertura de red de la dirección de un cliente directo a BD
   * @param {CLienthomepassDto} cLienthomepassDto
   */
  abstract putClientHomePass(data: CLienthomepassDto): any;
}
