
/**
 * Clase donde se definen los campos para la coleccion de la trazabilidad
 * @author Yhon Estevez
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceTracing, ServiceTracingModel } from '@claro/generic-models-library';
import * as APM from '@claro/general-utils-library';

import { IServiceTracingProvider } from '../service-tracing.provider';
import databaseConfig from '../../common/configuration/database.config';
import { Etask } from '../../common/utils/enums/taks.enum';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import generalConfig from '../../common/configuration/general.config';

@Injectable()
export class ServiceTracingProvider implements IServiceTracingProvider {

    constructor(
        @InjectModel(ServiceTracingModel.name, databaseConfig.database) private readonly serviceTracingModel: Model<ServiceTracingModel>,
    ) { }

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