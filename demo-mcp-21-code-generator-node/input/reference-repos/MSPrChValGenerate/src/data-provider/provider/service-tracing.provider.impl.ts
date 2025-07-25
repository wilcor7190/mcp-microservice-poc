/**
 * Clase con la definición de operaciones a realizar en la coleccion tracing
 * @author Uriel Esguerra
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IServiceTracing,ServiceTracingModel } from '@claro/generic-models-library';
import { IServiceTracingProvider } from '../service-tracing.provider';
import Logging from 'src/common/lib/logging';
import { Etask } from "src/common/utils/enums/taks.enum";
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import databaseConfig from 'src/common/configuration/database.config';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from 'src/common/utils/enums/tracing.enum';
import generalConfig from "src/common/configuration/general.config";

@Injectable()
export class ServiceTracingProvider implements IServiceTracingProvider {

    constructor(
        @InjectModel(ServiceTracingModel.name, databaseConfig.database) private readonly serviceTracingModel: Model<ServiceTracingModel>,
    ) { }
    private readonly logger = new Logging(ServiceTracingProvider.name);


    /**
    * Operación de inserción de la trazabilidad de los ms
    * @param {IServiceTracing} serviceTracing arreglo con información la trazabilidad de
    */
    async createServiceTracing(serviceTracing: IServiceTracing) {
        if (!generalConfig.logTrazabililty) return;
        let spanIn: any;
        try {
            spanIn = APM.startSpan(ServiceTracingModel.name, MappingApiRest.DB, 'createServiceTracing', Etask.APM);
            await this.serviceTracingModel.insertMany(serviceTracing);

        } catch (error) {
            this.logger.write(error, Etask.SAVE_DATA, ELevelsErros.ERROR);
            this.logger.write('Error ocurrido al guardar datos en coll_traceability', Etask.SAVE_DATA, ELevelsErros.ERROR);
        } finally {
            if (spanIn) spanIn.end();
        }
    }

}