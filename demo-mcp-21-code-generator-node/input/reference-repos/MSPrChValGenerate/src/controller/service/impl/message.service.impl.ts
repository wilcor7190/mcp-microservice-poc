/**
 * Clase para realizar las respectivas operaciones de mensajes de los ms
 * @author alexisterzer
 */
import { Injectable } from '@nestjs/common';
import { IMessageDTO } from '../../dto/message/message.dto';
import { IMessage } from '@claro/generic-models-library';
import { IMessageUc } from '../../../core/use-case/resource/message.uc';
import { IMessageService } from '../message.service';
import { ResponseService } from 'src/controller/dto/response-service.dto';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';
import { MessageUcimpl } from 'src/core/use-case/resource/impl/message.uc.impl';
import Logging from 'src/common/lib/logging';

@Injectable()
export class MessageService implements IMessageService {
  constructor(private readonly _messageUC: IMessageUc) { }

  private readonly logger = new Logging(MessageService.name);


  /**
    * Actualiza un mensaje
    * @param {IMessageDTO} message Información asociada al mensaje
    * @returns {ResponseService} Lógica del caso de uso en el response de la operación
    */
  async update(message: IMessageDTO): Promise<ResponseService<IMessage>> {
    const result = await this._messageUC.update(message);
    return new ResponseService(
      true,
      'Mensaje actualizado correctamente.',
      200,
      result,
    );
  }

  /**
    * Consulta mensaje por Id
    * @param {string} idMessage Identificador del mensaje
    * @returns {ResponseService} Lógica del caso de uso en el response de la operación
    */
  async getById(idMessage: string): Promise<ResponseService<IMessage>> {
    const result: IMessage = await this._messageUC.getById(idMessage);
    return new ResponseService(
      true,
      result != null
        ? 'Consulta ejecutada correctamente.'
        : `No se encontró mensaje configurado con el Id "${idMessage}".`,
      200,
      result,
    );
  }

  /**
    * Consulta los mensajes segun el filtro 
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter Objeto de campos a consultar
    * @returns {ResponseService} Lógica del caso de uso en el response de la operación
    */
  async getMessages(page: number, limit: number, filter: any, channel: string): Promise<ResponseService<any>> {

    // Mapeo de los campos de filtrado
    const _filter: object = JSON.parse(filter);

    const result = await this._messageUC.getMessages(page, limit, _filter);
    return new ResponseService(
      true,
      result
        ? 'Consulta ejecutada correctamente.'
        : 'No se encontraron datos.',
      200,
      result,
    );
  }

  /**
    * Consulta los mensajes segun el filtro 
    * @param {string} idMessage Identificador del mensaje
    * @returns {object} Informacion asociada a la busquedad
    */
  public static mappingMessage(idMessage: EmessageMapping): string {
    return MessageUcimpl.getMessages.find(m => m.id == idMessage)?.message;
  }

}
