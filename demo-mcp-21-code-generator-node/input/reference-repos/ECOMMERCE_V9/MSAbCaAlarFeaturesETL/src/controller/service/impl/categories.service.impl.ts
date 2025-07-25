import { Injectable, HttpStatus } from "@nestjs/common";
import generalConfig from "../../../common/configuration/general.config";
import Logging from "../../../common/lib/logging";
import Traceability from "../../../common/lib/traceability";
import { Etask, ETaskDesc, ETaskTrace } from "../../../common/utils/enums/taks.enum";
import { ResponseService } from "../../../controller/dto/response-service.dto";
import { ICategoriesUC } from "../../../core/use-case/categories.uc";
import { IServiceTracingUc } from "../../../core/use-case/resource/service-tracing.resource.uc";
import { IParamProvider } from "../../../data-provider/param.provider";
import { ICategoriesService } from '../categories.service';
import * as APM from '@claro/general-utils-library';

/**
 * Clase para realizar la actualización de las caracteristicas
 * @author Santiago Vargas
 */

@Injectable()
export class CategoriesService implements ICategoriesService {
  private readonly logger = new Logging(CategoriesService.name);
  constructor(
    private readonly _categoriesUc: ICategoriesUC,
    public readonly _paramsProvider: IParamProvider,
    private readonly _serviceTracing: IServiceTracingUc
  ) { }

  /**
   * Operación para actualizar las caracteristicas
   */
  async updateFeatures(): Promise<ResponseService> {
    const transaction = await APM.startTransaction(`jobUpdateFeatures - Inicia el proceso de actualización`);
    try{
      this.logger.write("Obteniendo categorias", Etask.UPDATE_FEATURES);
      const categories = await this._paramsProvider.getParamByIdParam("Categorias");
      if (categories && categories.values.length > 0) {
        this._categoriesUc.updateFeatures(categories);
  
        return new ResponseService(
          true,
          'Inicia el proceso de actualización',
          200
        ); 
      } else {
        let traceability = new Traceability({ origin: `${generalConfig.apiVersion}${generalConfig.controllerCategories}` });
        this.logger.write('No se encontraron categorias', Etask.UPDATE_FEATURES);
        traceability.setStatus(ETaskTrace.SUCCESS);
        traceability.setDescription(Etask.UPDATE_FEATURES);
        traceability.setTask(ETaskDesc.ERROR_UPDATE_FEATURES);
        this._serviceTracing.createServiceTracing(traceability.getTraceability());
  
        return new ResponseService(true, 'No se encontrarón categorías', HttpStatus.CREATED);
      }
    }finally {
      transaction.end();
    }
  }
  /**
   * Operación para actualizar las caracteristicas
   */
  async jobUpdateFeatures(): Promise<void> {
    const transaction = await APM.startTransaction(`jobUpdateFeatures - Inicia el proceso de actualización`);
    try{
      this.logger.write("Obteniendo categorias", Etask.UPDATE_FEATURES);
      const categories = await this._paramsProvider.getParamByIdParam("Categorias");
      if (categories && categories.values.length > 0) {
        this.logger.write('Inicia actualizar features', Etask.START_UPDATE_FEATURES);
        await this._categoriesUc.updateFeatures(categories);
        this.logger.write('Finaliza actulizar features', Etask.FINISH_UPDATE_FEATURES);
      } else {
        let traceability = new Traceability({ origin: `${generalConfig.apiVersion}${generalConfig.controllerCategories}` });
        this.logger.write('No se encontraron categorias', Etask.UPDATE_FEATURES);
        traceability.setStatus(ETaskTrace.SUCCESS);
        traceability.setDescription(Etask.UPDATE_FEATURES);
        traceability.setTask(ETaskDesc.ERROR_UPDATE_FEATURES);
        this._serviceTracing.createServiceTracing(traceability.getTraceability());
      }
    }finally {
      transaction.end();
    }
  }
}