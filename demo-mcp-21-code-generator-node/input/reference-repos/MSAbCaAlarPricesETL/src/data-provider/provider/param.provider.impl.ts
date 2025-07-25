import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IParam } from '../../core/entity/param/param.entity';
import { IParamProvider } from '../param.provider';
import databaseConfig from '../../common/configuration/database.config';
import { ParamModel } from '@claro/generic-models-library';

@Injectable()
export class ParamProvider implements IParamProvider {

    constructor(
        @InjectModel(ParamModel.name, databaseConfig.database) private readonly paramModel: Model<ParamModel>,
    ) { }

    async getTotal(filter: any): Promise<number> {
        return this.paramModel.countDocuments(filter);
    }

    async getParams(page: number, limit: number, filter: any, projection: any = {}): Promise<IParam[]> {
        return this.paramModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit)
            .lean();
    }

    async getParamByIdParam(id_param: string): Promise<IParam> {
        return this.paramModel.findOne({ id_param });
    }

}