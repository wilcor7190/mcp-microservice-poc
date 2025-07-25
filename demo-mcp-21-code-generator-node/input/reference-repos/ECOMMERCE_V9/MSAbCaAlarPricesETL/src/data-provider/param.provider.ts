import { Injectable } from '@nestjs/common';
import { IParam } from '../core/entity/param/param.entity';

@Injectable()
export abstract class IParamProvider {

    abstract getParams(page: number, limit: number, filter: any): Promise<IParam[]>;

    abstract getTotal(filter: any): Promise<number>;

    abstract getParamByIdParam(id_param: string): Promise<IParam>;

}