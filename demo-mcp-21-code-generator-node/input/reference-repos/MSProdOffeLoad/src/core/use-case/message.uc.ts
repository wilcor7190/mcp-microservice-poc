/**
 * Clase abstracta con la funcionalidad de los mensajes del ms
 * @author Oscar Avila
 */
import { Injectable } from '@nestjs/common';
import { ResponsePaginator } from '../../controller/dto/response-paginator.dto';
import { IMessage } from '@claro/generic-models-library';
@Injectable()
export abstract class IMessageUc {

    /**
    * Función para cargar los mensajes en las variables estaticas
    */
    abstract loadMessages(): Promise<any>;

    /**
    * Consulta mensajes configurados
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter Objeto de campos a consultar
    */
    abstract getMessages(page: number, limit: number, filter: any): Promise<ResponsePaginator<IMessage>>;

}