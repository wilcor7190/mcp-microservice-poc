import { Injectable } from '@nestjs/common';
import { ResponseService } from '../dto/response-service.dto';

/**
 * Clase abstracta para la actualización de las caracteristicas
 * @author Santiago Vargas
 */
@Injectable()
export abstract class ICategoriesService {
  /**
   * Actualiza las caracteristicas de cada categoria
   */
  abstract updateFeatures(): Promise<ResponseService>;
  abstract jobUpdateFeatures(): Promise<void>;
}
