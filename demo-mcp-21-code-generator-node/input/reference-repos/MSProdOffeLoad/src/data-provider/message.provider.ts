/**
 * Clase abstracta con la definición de operaciones a realizar en la coleccion coll_messages 
 * @author Oscar Avila
 */
import { IMessage } from '@claro/generic-models-library';
import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class IMessageProvider {

    /**
    * Operación para consultar mensajes según filtro
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @param {Object} filter arreglo de campos a consultar
    */
    abstract getMessages(page: number, limit: number, filter: any): Promise<IMessage[]>;

    /**
    * Operación para consultar cantidad de registros
    * @param {Object} filter arreglo de campos a consultar
    */
    abstract getFilter(filter: any): Promise<number>;


}