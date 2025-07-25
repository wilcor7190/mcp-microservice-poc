/**
 * Clase abstracta para almacenar los metodos de ejecucion del Job
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class IJobService {
  /**
   * Firma del metodo para ejecutar el Job
   */
  abstract execJob(): Promise<ResponseService>;
}
