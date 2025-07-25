/**
 * Clase con la funcionalidad de los mensajes del ms
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { BusinessException } from './../../../common/lib/business-exceptions';
import { IMessage } from '@claro/generic-models-library';
import { IMessageProvider } from './../../../data-provider/message.provider';
import { IMessageUc } from './../message.uc';
import { ResponsePaginator } from '../../../controller/dto/response-paginator.dto';
import Logging from '../../../common/lib/logging';
import { Etask } from '../../../common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';

@Injectable()
export class MessageUcimpl implements IMessageUc {
  private static messages: IMessage[] = [];
  private readonly logger = new Logging(MessageUcimpl.name);

  constructor(public readonly _messageProvider: IMessageProvider) {}

  /**
   * Al cargar el modulo se ejecuta la lógica de carga de mensajes en memoria
   */
  async onModuleInit() {
    await this.loadMessages();
  }

  /**
   * Retorna todos los mensajes configurados
   * @returns {Object} Información mensajes configurados
   */
  public static get getMessages(): IMessage[] {
    return MessageUcimpl.messages;
  }

  /**
   * Función para cargar los mensajes en las variables estaticas
   */
  async loadMessages(): Promise<any> {
    let message: IMessage[] = [];
    try {
      message = await this._messageProvider.getMessages(1, 100, {});
    } catch (error) {
      this.logger.write(`Error cargando mensajes`, Etask.LOAD_MESSAGE, ELevelsErrors.INFO, error);
    } finally {
      // Actualizar variable estática
      MessageUcimpl.messages = message;
    }
  }

  /**
   * Consulta mensaje por Identificador
   * @param {string} idMessage Identificador del mensaje
   * @returns {Object} Información asociada mensaje
   */
  async getById(idMessage: string): Promise<IMessage> {
    return this._messageProvider.getMessage(idMessage);
  }

  /**
   * Consulta mensajes configurados
   * @param {Number} page Número de página a consultar
   * @param {Number} limit Cantidad de registros por página
   * @param {Object} filter Objeto de campos a consultar
   * @returns {ResponsePaginator} Respuesta paginada con información de los mensajes
   */
  async getMessages(page: number, limit: number, filter: any): Promise<ResponsePaginator<IMessage>> {
    const total: number = await this._messageProvider.getTotal(filter);
    if (total == 0) throw new BusinessException(400, 'No se encontró información con los filtros indicados');

    const documents = await this._messageProvider.getMessages(page, limit, filter);

    return new ResponsePaginator(documents, page, limit);
  }
}
