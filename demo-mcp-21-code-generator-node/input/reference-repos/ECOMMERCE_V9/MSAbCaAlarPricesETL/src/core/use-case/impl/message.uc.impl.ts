import { Injectable } from '@nestjs/common';
import { BusinessException } from './../../../common/lib/business-exceptions';
import { IMessageProvider } from './../../../data-provider/message.provider';
import { IMessageUc } from './../message.uc';
import { ResponsePaginator } from '../../../controller/dto/response-paginator.dto';
import Logging from '../../../common/lib/logging';
import { Etask } from '../../../common/utils/enums/taks.enum';
import { ELevelsErros } from '../../../common/utils/enums/logging.enum';
import { IMessage } from '@claro/generic-models-library';



@Injectable()
export class MessageUcimpl implements IMessageUc {

    private static messages: IMessage[] = [];
    private readonly logger = new Logging(MessageUcimpl.name);

    constructor(
        public readonly _messageProvider: IMessageProvider
    ) { }

    /**
    * Al cargar el modulo se ejecuta la lógica de carga de mensajes en memoria
    */
    async onModuleInit() {
        await this.loadMessages();
    }

    public static get getMessages(): IMessage[] {
        return MessageUcimpl.messages;
    }


    async loadMessages(): Promise<any> {
        let message: IMessage[] = [];
        try {
            message = await this._messageProvider.getMessages(1, 100, {});
            
        } catch (error) {
            this.logger.write(`Error cargando mensajes`, Etask.LOAD_MESSAGE, ELevelsErros.ERROR, error);
        } finally {
            // Actualizar variable estática
            MessageUcimpl.messages = message;
        }
    }


    async update(message: IMessage): Promise<IMessage> {
        const result = await this._messageProvider.updateMessage(message);
        if (result == null)
            throw new BusinessException(400, 'No existe un mensaje con el código indicado', true);

        // Si se actualiza en bd, actualizar variable estática
        const messagePosition = MessageUcimpl.messages.findIndex(msg => msg.id === message.id);
        MessageUcimpl.messages[messagePosition] = message;

        return result;
    }


    async getById(idMessage: string): Promise<IMessage> {
        return this._messageProvider.getMessage(idMessage);
    }


    async getMessages(page: number, limit: number, filter: any): Promise<ResponsePaginator<IMessage>> {

        const total: number = await this._messageProvider.getTotal(filter);
        if (total == 0)
            throw new BusinessException(400, 'No se encontró información con los filtros indicados');

        const documents = await this._messageProvider.getMessages(
            page,
            limit,
            filter
        );

        return new ResponsePaginator(documents, page, limit);
    }

}