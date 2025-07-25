/**
 * Clase con la definición de operaciones a realizar en la coleccion coll_messages
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMessageProvider } from '../message.provider';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from 'src/common/utils/enums/mapping-api-rest';
import { Etask } from '../../common/utils/enums/task.enum';
import { MessageModel, IMessage, ETask, GlobalStorageUtil } from '@claro/generic-models-library';
import Logging from 'src/common/lib/logging';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import Traceability from 'src/common/lib/traceability';
import { EStatusTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { IServiceTracingProvider } from '../service-tracing.provider';
import databaseConfig from 'src/common/configuration/database.config';
@Injectable()
export class MessageProvider implements IMessageProvider {
  private readonly logger = new Logging(MessageProvider.name);
  
  constructor(@InjectModel(MessageModel.name) private readonly messageModel: Model<MessageModel>,private readonly _serviceTracing: IServiceTracingProvider) {}

  onModuleInit() {
    this.loadMessages();
    if (databaseConfig.mongoReplicaSet) this.watchChanges();
  }


  async loadMessages(): Promise<void> {
    let messages: IMessage[] = [];
    try {
      messages = await this.messageModel.find().exec();
    } catch (error) {
      this.logger.write(`Error cargando mensajes`, ETask.LOAD_MESSAGE, ELevelsErrors.ERROR, null, error);
    } finally {
      GlobalStorageUtil.messages = messages;
    }
  }

  watchChanges() {
    try {
      const observable = this.messageModel.watch();
      observable.on('change', (info: any) => {
        this.logger.write(
          `Inicio detención de cambios en la colección de mensajes`,
          Etask.LOAD_MESSAGE,
          ELevelsErrors.INFO,
          null,
          info,
        );
        const traceability = new Traceability({});
        traceability.setTransactionId('9999');
        traceability.setTask('OBSERVABLE (detección de cambios en la colección de mensajes)' + Etask.LOAD_PARAM);
        traceability.setStatus(EStatusTracingGeneral.BD_SUCCESS);
        traceability.setRequest('change');
        traceability.setResponse(info);
        this._serviceTracing.createServiceTracing(traceability.getTraceability());
        this.loadMessages();
      });
    } catch (error) {
      this.logger.write(
        `Error detectando cambios en la colección de mensajes`,
        Etask.LOAD_PARAM,
        ELevelsErrors.ERROR,
        null,
        error,
      );
    }
  }

  /**
   * Operación para consultar cantidad de registros
   * @param {Object} filter arreglo de campos a consultar
   * @returns {Number} total registros
   */
  async getTotal(filter: any): Promise<number> {
    let spanIn: any;
    try {
        spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'getTotal',Etask.APM);
        
        return this.messageModel.countDocuments(filter);
    }
    finally{
        if(spanIn) spanIn.end();
    }
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
    let spanIn: any;
    try {
        spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'getMessages',Etask.APM);
       
        return this.messageModel
          .find(filter, projection)
          .skip(limit * (page - 1))
          .limit(limit);
    }
    finally{
        if(spanIn) spanIn.end();
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
        spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'getMessage',Etask.APM);
       
        return this.messageModel.findOne({ id });
    }
    finally{
        if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para consultar cantidad de registros
   * @param {Object} filter arreglo de campos a consultar
   * @returns {Number} total registros
   */
  async getFilter(filter: any): Promise<number> {
    let spanIn: any;
    try {
        spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'getFilter',Etask.APM);
       
        return this.messageModel.countDocuments(filter);
    }
    finally{
        if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación de inserción de un mensaje
   * @param {IMessage} message arreglo con información del mensaje
   * @returns {Boolean} estado resultado operacion
   */
  async createMessages(messages: IMessage[]): Promise<boolean> {
    let spanIn: any;
    try {
        spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'createMessages',Etask.APM);
        await this.messageModel.insertMany(messages);
        return true;
      }
      finally{
          if(spanIn) spanIn.end();
      }
  }

  /**
   * Operación de actualización de un mensaje
   * @param {IMessage} message arreglo con información del mensaje
   * @returns {Object} mensaje actualizado
   */
  async updateMessage(message: IMessage): Promise<IMessage> {
    let spanIn: any;
    try {
        spanIn = APM.startSpan(MessageModel.name, MappingApiRest.DB,'updateMessage',Etask.APM);
        return this.messageModel.findOneAndUpdate(
          {
            id: message.id,
          },
          {
            $set: {
              id: message.id,
              description: message.description,
              message: message.message,
            },
          },
          {
            new: true,
          },
        );
      }
      finally{
          if(spanIn) spanIn.end();
      }
  }
}
