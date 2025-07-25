/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion coll_messages 
 * @author alexisterzer
 */

import { Injectable } from '@nestjs/common';
import { IMessage } from '@claro/generic-models-library';

@Injectable()
export abstract class IMessageProvider {

    abstract getMessages(page: number, limit: number, filter: any): Promise<IMessage[]>;

    abstract getTotal(filter: any): Promise<number>

    abstract getMessage(id: string): Promise<IMessage>;

    abstract updateMessage(message: IMessage): Promise<IMessage>;

}