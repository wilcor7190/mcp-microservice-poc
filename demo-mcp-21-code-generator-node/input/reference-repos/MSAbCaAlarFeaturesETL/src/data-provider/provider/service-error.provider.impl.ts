import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  IServiceError,
  ServiceErrorModel,
} from '@claro/generic-models-library';
import * as APM from '@claro/general-utils-library';
import { IServiceErrorProvider } from '../service-error.provider';
import databaseConfig from '../../common/configuration/database.config';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import { Etask } from '../../common/utils/enums/taks.enum';
@Injectable()
export class ServiceErrorProvider implements IServiceErrorProvider {
  constructor(
    @InjectModel(ServiceErrorModel.name, databaseConfig.dbFeatures)
    private readonly serviceErrorModel: Model<ServiceErrorModel>,
  ) {}

  /**
   * Operación para consultar cantidad de errores según filtro
   * @param {*} filter arreglo de campos a consultar
   * @returns {Number} numero total errores asociados
   */
  async getTotal(filter: any): Promise<number> {
    return this.serviceErrorModel.countDocuments(filter);
  }

  /**
   * Operación para consultar errores según filtro
   * @param {*} filter arreglo de campos a consultar
   * @param {*} projection
   * @returns {Object} informacion asociada
   */
  async getServiceErrors(
    filter: any,
    projection: any = {},
  ): Promise<IServiceError[]> {
    return this.serviceErrorModel.find(filter, projection);
  }

  /**
   * Operación para consultar errores por identificador
   * @param {String} id identificador de error
   * @returns {Object} Información asociada al error
   */
  async getServiceError(id: string): Promise<IServiceError> {
    return this.serviceErrorModel.findOne({ id });
  }

  /**
   * Operación de inserción de un error
   * @param {IServiceError} serviceError arreglo con información del error
   */
  async createServiceError(serviceError: IServiceError) {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(
        ServiceErrorProvider.name,
        MappingApiRest.DB,
        'createServiceError',
        Etask.APM,
      );
      return this.serviceErrorModel.insertMany(serviceError);
    } finally {
      if (spanIn) spanIn.end();
    }
  }
}
