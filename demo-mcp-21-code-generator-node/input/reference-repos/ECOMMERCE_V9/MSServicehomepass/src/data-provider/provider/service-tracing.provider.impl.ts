/**
 * Clase que se implementa para almacenar las firmas de los metodos que gestionan la trazabilidad directamente en BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceTracingProvider } from '../service-tracing.provider';
import { MappingApiRest } from 'src/common/utils/enums/mapping-api-rest';
import * as APM from '@claro/general-utils-library';
import { Etask } from 'src/common/utils/enums/task.enum';
import { ServiceTracingModel, IServiceTracing } from '@claro/generic-models-library';
import generalConfig from 'src/common/configuration/general.config';
@Injectable()
export class ServiceTracingProvider implements IServiceTracingProvider {
  constructor(@InjectModel(ServiceTracingModel.name) private readonly serviceTracingModel: Model<ServiceTracingModel>) {}

  /**
   * Operación de inserción de la trazabilidad de los ms
   * @param {IServiceTracing} serviceTracing arreglo con información la trazabilidad de
   */
  async createServiceTracing(serviceTracing: IServiceTracing) {
    if (!generalConfig.logTrazabililty) return;
    let spanIn: any;
        try {
            spanIn = APM.startSpan(ServiceTracingModel.name, MappingApiRest.DB,'createServiceTracing',Etask.APM);
            await this.serviceTracingModel.insertMany(serviceTracing);
        }
        finally{
            if(spanIn) spanIn.end();
        }
  }
}
