/**
 * Obtiene la configuracion y construción del mensaje
 * @author alexisterzer
 */

import { Injectable } from '@nestjs/common';
import { ResponsePaginator } from 'src/controller/dto/response-paginator.dto';
import { IMessage } from '@claro/generic-models-library';
@Injectable()
export abstract class IMessageUc {

    abstract loadMessages(): Promise<any>;

    abstract update(message: IMessage): Promise<IMessage>;

    abstract getById(idMessage: string): Promise<IMessage>;

    abstract getMessages(page: number, limit: number, filter: any): Promise<ResponsePaginator<IMessage>>;

}