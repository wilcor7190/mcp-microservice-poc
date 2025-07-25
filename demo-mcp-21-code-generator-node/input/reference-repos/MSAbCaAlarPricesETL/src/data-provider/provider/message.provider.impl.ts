import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessageProvider } from '../message.provider';
import databaseConfig from '../../common/configuration/database.config';
import { MessageModel, IMessage } from '@claro/generic-models-library';

@Injectable()
export class MessageProvider implements IMessageProvider {

    constructor(
        @InjectModel(MessageModel.name, databaseConfig.database) private readonly messageModel: Model<MessageModel>,
    ) { }


    async getTotal(filter: any): Promise<number> {
        return this.messageModel.countDocuments(filter);
    }
    
    async getMessages(page: number, limit: number, filter: any, projection: any = {}): Promise<IMessage[]> {
        return this.messageModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit);
    }


    async getMessage(id: string): Promise<IMessage> {
        return this.messageModel.findOne({ id });
    }


    async createMessages(messages: IMessage[]): Promise<boolean> {

        await this.messageModel.insertMany(messages);
        return true;
    }


    async updateMessage(message: IMessage): Promise<IMessage> {

       return this.messageModel.findOneAndUpdate(
            {
                id: message.id,
            },
            {
                $set: {
                    id: message.id,
                    description: message.description,
                    message: message.message
                }
            },
           {
               new: true
           }
        );
    }
}