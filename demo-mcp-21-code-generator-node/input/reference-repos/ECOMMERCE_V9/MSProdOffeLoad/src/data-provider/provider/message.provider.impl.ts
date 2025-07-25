/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_messages 
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessageProvider } from '../message.provider';
import databaseConfig from '../../common/configuration/database.config';
import { IMessage, MessageModel } from '@claro/generic-models-library';

@Injectable()
export class MessageProvider implements IMessageProvider {

    constructor(
        @InjectModel(MessageModel.name, databaseConfig.database) private readonly messageModel: Model<MessageModel>,
    ) { }

    /**
    * Operación para consultar cantidad de registros
    * @param {Object} filter arreglo de campos a consultar
    * @returns {Number} total registros 
    */
    async getFilter(filter: any): Promise<number> {
        return this.messageModel.countDocuments(filter);
    }
    
    /**
    * Operación para consultar mensajes según filtro
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter arreglo de campos a consultar
    * @param {Object} projection arreglo de campos a devolver
    * @returns {Object} Información mensajes
    */
    async getMessages(page: number, limit: number, filter: any, projection: any = {}): Promise<IMessage[]> {
        return this.messageModel.find(filter, projection)
            .skip(limit * (page - 1))
            .limit(limit);
    }

}