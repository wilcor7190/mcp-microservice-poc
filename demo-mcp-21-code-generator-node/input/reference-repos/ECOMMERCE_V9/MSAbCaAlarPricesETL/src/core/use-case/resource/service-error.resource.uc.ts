import { ITaskError } from '@claro/generic-models-library';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IServiceErrorUc {

    // abstract getServiceErrors(page: number, limit: number, filter: any): Promise<ResponsePaginator<IServiceError>>;
    abstract createServiceError(error: any, task: ITaskError);
    abstract getServiceErrors( filter: any)
}