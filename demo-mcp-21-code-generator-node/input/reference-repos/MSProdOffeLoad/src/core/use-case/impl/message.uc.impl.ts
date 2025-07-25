/**
 * Clase abstracta con la funcionalidad de los mensajes del ms
 * @author Oscar Avila
 */

import { Injectable } from '@nestjs/common';
import { BusinessException } from './../../../common/lib/business-exceptions';
import { IMessageProvider } from './../../../data-provider/message.provider';
import { IMessageUc } from './../message.uc';
import { ResponsePaginator } from '../../../controller/dto/response-paginator.dto';
import Logging from '../../../common/lib/logging';
import { Etask } from '../../../common/utils/enums/taks.enum';
import { IMessage } from '@claro/generic-models-library';

@Injectable()
export class MessageUcimpl implements IMessageUc {

    private static messages: IMessage[] = [];
    private readonly logger = new Logging(MessageUcimpl.name);

    constructor(
        public readonly messageProvider: IMessageProvider
    ) { }

    /**
    * Al cargar el modulo se ejecuta la lógica de carga de mensajes en memoria
    */
    async onModuleInit() {
        await this.loadMessages();
    }

    /**
    * Consulta mensaje por Identificador
    * @param {string} idMessage Identificador del mensaje
    */
    public static get getMessages(): IMessage[] {
        return MessageUcimpl.messages;
    }


    /**
     * Metodo para cargar mensajes en coll_message
     */
    async loadMessages(): Promise<any> {
        let message: IMessage[] = [];
        try {
            message = await this.messageProvider.getMessages(1, 100, {});
        } catch (error) {
            this.logger.write(`Error cargando mensajes`, Etask.LOAD_MESSAGE, error);
        } finally {
            // Actualizar variable estática
            MessageUcimpl.messages = message;
        }
    }

    /**
    * Consulta mensajes configurados
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter Objeto de campos a consultar
    */
    async getMessages(page: number, limit: number, filter: any): Promise<ResponsePaginator<IMessage>> {
            let total = await this.messageProvider.getFilter(filter);
        if (total == 0)
            throw new BusinessException(400, 'No se encontró información con los filtros indicados');
        let message = await this.messageProvider.getMessages(page,limit,filter);
        return new ResponsePaginator(message, page, limit);
    }

}