import { Injectable } from '@nestjs/common';
import { IParam } from '../../../core/entity/param/param.entity';

@Injectable()
export abstract class IParamUc {

    abstract loadParams(): Promise<IParam[]>;

}