/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_messages 
 * @author Fredy Santiago Martinez
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessage } from 'src/core/entity/message.entity';
import { IMessageProvider } from '../message.provider';
import { MessageModel } from '../model/message.model';

@Injectable()
export class MessageProvider implements IMessageProvider {

    constructor(
        @InjectModel(MessageModel.name) private readonly messageModel: Model<MessageModel>,
    ) { }

    /** 
        * Operación para consultar cantidad de mensajes
        * @param {Object} filter arreglo de campos a consultar
        * @returns {Number} numero total mensajes asociados
        */
    async getTotal(filter: any): Promise<number> {
        return this.messageModel.countDocuments(filter);
    }

    /**
    * Operación para consultar mensajes según filtro
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter arreglo de campos a consultar
    * @returns {Object} informacion asociada a la busquedad
    */
    async getMessages(page: number, limit: number, filter: any, projection: any = {}): Promise<IMessage[]> {
        return this.messageModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit);
    }

    /**
    * Operación para consultar un mensaje por su identificador
    * @param {String} id identificador de mensaje
    * @returns {Object} informacion asociada a la busquedad
    */
    async getMessage(id: string): Promise<IMessage> {
        return this.messageModel.findOne({ id });
    }


    /**
    * Operación de actualización de un mensaje
    * @param {IMessage} message arreglo con información del mensaje
    * @returns {Object} informacion asociada a la actualizacion
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