/**
 * Clase para realizar las respectivas operaciones de los ms
 * @author Hamilton Acevedo
 */

import { Injectable } from '@nestjs/common';
import { ISkuSondService } from '../sku-sond.service';
import { IGlobalValidateIService } from '../globalValidate.service';
import { assignTaskError } from '@claro/general-utils-library';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import Logging from 'src/common/lib/logging';
import { ISKUSondUc } from 'src/core/use-case/sku-sond.uc';


@Injectable()
export class SkuSondServiceImpl implements ISkuSondService {

    constructor(
        private readonly globalValidateServ: IGlobalValidateIService,
        private readonly skuSondUc: ISKUSondUc,
    ){}

    private readonly logger = new Logging(SkuSondServiceImpl.name);

    /**
     * Metodo que consulta el legado con el Sku hijo a traves del servicio que obtiene un producto secundario homólogo al SKU del producto principal
     * @param {string} sku valor a consultar
     * @param {string} salesType tipo de venta
     * @param {string} channel canal
     */
    async getInfoSku(sku: string, salesType: string, channel:string) {
        this.logger.write('getInfoSku()', Etask.SKUSOND_CONTROLLER, ELevelsErros.INFO, {sku, salesType, channel});
        try {
            await this.globalValidateServ.validateChannel(channel);
            return this.skuSondUc.getSKUSond(sku, salesType, channel);
        } catch (error) {
            assignTaskError(error, Etask.SKUSOND_CONTROLLER, ETaskDesc.ERROR_SKUSOND_SERVICE);
            throw error;
        }

    }

}