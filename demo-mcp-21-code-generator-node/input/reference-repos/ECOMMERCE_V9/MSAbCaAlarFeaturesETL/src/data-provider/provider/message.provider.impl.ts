import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { IMessage, MessageModel } from '@claro/generic-models-library';
import { Model } from 'mongoose';
import { IMessageProvider } from '../message.provider';
import * as APM from '@claro/general-utils-library';
import { Etask } from '../../common/utils/enums/taks.enum';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import databaseConfig from '../../common/configuration/database.config';

/**
 * Clase con la implementación de las operaciones a realizar en la coleccion coll_messages
 * @author Marlyn Tatiana Quiroz
 */
@Injectable()
export class MessageProvider implements IMessageProvider {
  constructor(
    @InjectModel(MessageModel.name, databaseConfig.dbFeatures)
    private readonly messageModel: Model<MessageModel>,
  ) {}

  /**
   * Operación para consultar cantidad de registros
   * @param {Object} filter arreglo de campos a consultar
   * @returns {Number} total registros
   */
  async getTotal(filter: any): Promise<number> {
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
  async getMessages(
    page: number,
    limit: number,
    filter: any,
    projection: any = {},
  ): Promise<IMessage[]> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'getMessages',Etask.APM);
      return this.messageModel
        .find(filter, projection)
        .skip(limit * (page - 1))
        .limit(limit);
    } finally {
      if (spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar mensajes por identificador
   * @param {String} id identificador de mensaje
   * @returns {Object} Información mensajes
   */
  async getMessage(id: string): Promise<IMessage> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'getMessages',Etask.APM);
      return this.messageModel.findOne({ id });
    } finally {
      if (spanIn) spanIn.end();
    }
  }
}
