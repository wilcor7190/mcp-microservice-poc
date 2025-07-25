/**
 * Clase que se implementa  para gestion de registro de errores directamente en BD
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceErrorProvider } from '../service-error.provider';
import Logging from '../../common/lib/logging';
import { Etask } from '../../common/utils/enums/task.enum';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from 'src/common/utils/enums/mapping-api-rest';
import { IServiceError, ServiceErrorModel } from '@claro/generic-models-library';

@Injectable()
export class ServiceErrorProvider implements IServiceErrorProvider {
  private readonly logger = new Logging(ServiceErrorProvider.name);

  constructor(@InjectModel(ServiceErrorModel.name) private readonly serviceErrorModel: Model<ServiceErrorModel>) {}


  /**
   * Metodo para crear registros de errores
   * @param {any} error registro de error a crear
   * @param {ITaskError} task tarea que se estaba ejecutando cuando surgió el error
   * @returns una promesa
   */
  async createServiceError(serviceError: IServiceError) {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(ServiceErrorModel.name, MappingApiRest.DB,'createServiceError',Etask.APM);   
        
      await this.serviceErrorModel.insertMany(serviceError);
    }
    finally{
        if(spanIn) spanIn.end();
    }
  }
}
