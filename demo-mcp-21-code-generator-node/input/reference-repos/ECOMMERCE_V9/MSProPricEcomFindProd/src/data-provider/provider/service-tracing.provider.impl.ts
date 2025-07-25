/**
 * Clase donde se definen los campos para la coleccion de la trazabilidad
 * @author Fredy Santiago Martinez
*/

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceTracing } from 'src/core/entity/service-tracing/service-tracing.entity';
import { ServiceTracingModel } from '../model/service-tracing/service-tracing.model';
import { IServiceTracingProvider } from '../service-tracing.provider';
import * as APM from '@claro/general-utils-library';
import { Etask } from '../../common/utils/enums/taks.enum';
import { MappingApiRest } from './../../common/configuration/mapping-api-rest';

@Injectable()
export class ServiceTracingProvider implements IServiceTracingProvider {

    constructor(
        @InjectModel(ServiceTracingModel.name) private readonly serviceTracingModel: Model<ServiceTracingModel>,
    ) { }
 
    /**
    * Operación de inserción de la trazabilidad de los ms
    * @param {IServiceTracing} serviceTracing arreglo con información la trazabilidad de
    */
    async createServiceTracing(serviceTracing: IServiceTracing) {
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