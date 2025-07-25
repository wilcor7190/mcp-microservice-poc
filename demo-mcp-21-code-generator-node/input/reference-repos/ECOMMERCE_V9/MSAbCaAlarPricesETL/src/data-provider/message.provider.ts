import { IMessage } from '@claro/generic-models-library';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IMessageProvider {

    abstract createMessages(messages: IMessage[]): Promise<boolean>;

    abstract getMessages(page: number, limit: number, filter: any): Promise<IMessage[]>;

    abstract getTotal(filter: any): Promise<number>

    abstract getMessage(id: string): Promise<IMessage>;

    abstract updateMessage(message: IMessage): Promise<IMessage>;

}