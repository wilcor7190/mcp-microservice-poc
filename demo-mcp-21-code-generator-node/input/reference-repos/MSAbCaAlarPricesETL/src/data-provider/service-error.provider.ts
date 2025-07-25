import { IServiceError } from '@claro/generic-models-library';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IServiceErrorProvider {

    abstract createServiceError(ServiceErrors: IServiceError);
    abstract getServiceErrors( filter: any): Promise<IServiceError[]>;
    abstract getTotal(filter: any): Promise<number>
    abstract getServiceError(id: string): Promise<IServiceError>;

}