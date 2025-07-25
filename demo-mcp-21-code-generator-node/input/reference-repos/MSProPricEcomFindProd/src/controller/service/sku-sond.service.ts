/**
 * Clase abstracta para realizar las respectivas 
 * @author Hamilton Acevedo
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export abstract class ISkuSondService {
    /**
     * Metodo que consulta el legado con el Sku hijo a traves del servicio que obtiene un producto secundario homólogo al SKU del producto principal
     * @param {string} sku valor a consultar
     * @param {string} salesType tipo de venta
     * @param {string} channel canal
     */
    abstract getInfoSku(sku: string, salesType: string, channel: string);
}