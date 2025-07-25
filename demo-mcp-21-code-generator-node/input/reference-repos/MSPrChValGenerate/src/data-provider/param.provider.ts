/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion coll_params 
 * @author alexisterzer
 */
import { Injectable } from '@nestjs/common';
import { IParam } from '@claro/generic-models-library'

@Injectable()
export abstract class IParamProvider {

    abstract getParams(page: number, limit: number, filter: any): Promise<IParam[]>;

    abstract getTotal(filter: any): Promise<number>;

    abstract getParamByIdParam(id_param: string): Promise<IParam>;

    abstract updateParam(param: IParam): Promise<IParam>;

    abstract setLoadTime(id_param: string): Promise<void>;

    abstract getFeaturesEnabled(family: string): Promise<any>; 
}