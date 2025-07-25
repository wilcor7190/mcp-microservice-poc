import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceTracing, ServiceTracingModel } from '@claro/generic-models-library';
import * as APM from '@claro/general-utils-library';

import { IServiceTracingProvider } from '../service-tracing.provider';
import databaseConfig from '../../common/configuration/database.config';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import { Etask } from '../../common/utils/enums/taks.enum';
import generalConfig from '../../common/configuration/general.config';

@Injectable()
export class ServiceTracingProvider implements IServiceTracingProvider {

    constructor(
        @InjectModel(ServiceTracingModel.name, databaseConfig.dbFeatures) private readonly serviceTracingModel: Model<ServiceTracingModel>,
    ) { }

    /**
    * Operación de inserción de la trazabilidad de los ms
    * @param {IServiceTracing} serviceTracing arreglo con información la trazabilidad de
    */
    async createServiceTracing(serviceTracing: IServiceTracing) {
        if (!generalConfig.logTrazabililty) return;
        let spanIn: any;
        try {
          spanIn = APM.startSpan(
            ServiceTracingModel.name,
            MappingApiRest.DB,
            'createServiceTracing',
            Etask.APM,
          );
          return this.serviceTracingModel.insertMany(serviceTracing);
        } finally {
          if (spanIn) spanIn.end();
        }
    }

}