/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_messages 
 * @author alexisterzer
 */

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessage , MessageModel} from '@claro/generic-models-library';
import { IMessageProvider } from '../message.provider';
import databaseConfig from 'src/common/configuration/database.config';

@Injectable()
export class MessageProvider implements IMessageProvider {

    constructor(
        @InjectModel(MessageModel.name,databaseConfig.database) private readonly messageModel: Model<MessageModel>,
    ) { }


    /** 
    * Operación para consultar cantidad de registros
    * @param {Object} filter arreglo de campos a consultar
    */
    async getTotal(filter: any): Promise<number> {
        return this.messageModel.countDocuments(filter);
    }

    /**
   * Operación para consultar mensajes según filtro
   * @param {Number} page Número de página a consultar
   * @param {Number} limit Cantidad de registros por página
   * @param {Object} filter arreglo de campos a consultar
   */
    async getMessages(page: number, limit: number, filter: any, projection: any = {}): Promise<IMessage[]> {
        return this.messageModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit);
    }

    /**
    * Operación para consultar un mensaje por su identificador
    * @param {String} id identificador de mensaje
    */
    async getMessage(id: string): Promise<IMessage> {
        return this.messageModel.findOne({ id });
    }

   /**
    * Operación de actualización de un mensaje
    * @param {IMessage} message arreglo con información del mensaje
    */
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