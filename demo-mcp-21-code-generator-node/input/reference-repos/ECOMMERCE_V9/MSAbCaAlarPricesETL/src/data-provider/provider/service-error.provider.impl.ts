import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ServiceErrorModel, IServiceError } from '@claro/generic-models-library';
import * as APM from '@claro/general-utils-library';

import { IServiceErrorProvider } from '../service-error.provider';
import databaseConfig from '../../common/configuration/database.config';
import { Etask } from '../../common/utils/enums/taks.enum';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
@Injectable()
export class ServiceErrorProvider implements IServiceErrorProvider {

    constructor(
        @InjectModel(ServiceErrorModel.name, databaseConfig.database) private readonly serviceErrorModel: Model<ServiceErrorModel>,
    ) { }

    async getTotal(filter: any): Promise<number> {
        return this.serviceErrorModel.countDocuments(filter);
    }

    async getServiceErrors( filter: any, projection: any = {}): Promise<IServiceError[]> {
        return this.serviceErrorModel.find(filter, projection)
    }

    async getServiceError(id: string): Promise<IServiceError> {
        return this.serviceErrorModel.findOne({ id });
    }

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