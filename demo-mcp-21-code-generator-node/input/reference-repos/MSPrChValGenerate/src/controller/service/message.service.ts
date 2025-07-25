/**
 * Clase abstracta para realizar las respectivas operaciones de mensajes de los ms
 * @author alexisterzer
 */

import { Injectable } from '@nestjs/common';
import { IMessageDTO } from '../dto/message/message.dto';
import { ResponseService } from '../dto/response-service.dto';

@Injectable()
export abstract class IMessageService {

    abstract update(message: IMessageDTO): Promise<ResponseService>;

    abstract getById(idMessage: string): Promise<ResponseService>;

    abstract getMessages(page: number, limit: number, filter: any, channel: string): Promise<ResponseService>;

}