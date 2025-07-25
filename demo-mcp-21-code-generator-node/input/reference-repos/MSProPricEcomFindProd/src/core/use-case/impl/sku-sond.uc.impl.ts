/**
 * Clase con la funcionalidad de consulta informacion de sku
 * @author Hamilton Acevedo
 */

import { HttpStatus, Injectable } from '@nestjs/common';
import { ISKUSondUc } from '../sku-sond.uc';
import { assignTaskError } from '@claro/general-utils-library';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import servicesConfig from 'src/common/configuration/services.config';
import { IHttpProvider } from 'src/data-provider/http.provider';
import Logging from 'src/common/lib/logging';
import { EHttpMethod, IRequestConfigHttp } from 'src/data-provider/model/http/request-config-http.model';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import { ISKUSond } from 'src/core/entity/sku-sond/sku-sond.entity';
import { BusinessException } from 'src/common/lib/business-exceptions';
import { EmessageMapping } from 'src/common/utils/enums/message.enum';


@Injectable()
export class SKUSondUcimpl implements ISKUSondUc {

    private readonly logger = new Logging(SKUSondUcimpl.name)

    constructor(private readonly httpProvider: IHttpProvider) { }

    /**
     * Metodo que consulta el legado con el Sku hijo a traves del servicio que obtiene un producto secundario homólogo al SKU del producto principal
     * @param {string} sku valor a consultar
     * @param {string} salesType tipo de venta
     * @param {string} channel canal
     */
    async getSKUSond(sku: string, salesType: string, channel: string) {
        try {
            //Objeto de canal
            const channelBody = this.objectChanel(channel);
            //consulta del legado
            const responseApi =  await this.consumeInventoryManage(sku, salesType);
            //response objeto
            if(responseApi.status !== HttpStatus.OK){
                this.responseErrorMessage(responseApi);
            }
            return this.objetoResponse(channelBody, responseApi);
        } catch (error) {
            assignTaskError(error, Etask.SKUSOND_CONTROLLER, ETaskDesc.ERROR_SKUSOND_SERVICE);
            throw error;
        }

    }

    /**
     * Objeto conpleto con informacion del canal
     * @param {string} channel 
     * @returns {Object} channel
     */
    objectChanel(channel) {
        return {
            '@type': servicesConfig["@type"],
            channel: {
                href: servicesConfig["channel/href"],
                id: channel,
                name: servicesConfig["channel/name"]
            }
        }
    }

    /**
     * consume el servicio
     * @param {string} sku valor a consultar
     * @param {string} salesType tipo de venta
     * @returns {Object} repuesta del legado
     */
    async consumeInventoryManage(sku: string, salesType: string) {
        try {
            this.logger.write('SKUSondUcimpl.getConsultSKUChild', Etask.CONSULT_ORDER_INFORMATION, ELevelsErros.INFO, JSON.stringify({sku, salesType}));
            const request: IRequestConfigHttp = {
                method: EHttpMethod.get,
                url: `${servicesConfig.inventoryManage}?sku=${sku}&salesType=${salesType}`,
            }
            return await this.httpProvider.executeRest(request, Etask.CONSULT_ORDER_INFORMATION)
        } catch (error) {
            this.logger.write('SKUSondUcimpl.consumeInventoryManage error => ', Etask.CONSULT_ORDER_INFORMATION, ELevelsErros.ERROR, JSON.stringify({sku, salesType}), JSON.stringify(error))
            assignTaskError(error, Etask.CONSULT_ORDER_INFORMATION, ETaskDesc.ERROR_CONSULT_ORDER_INFORMATION)
            throw error
        }
    }

    /**
     * Resultado final del objeto de microservicio
     * @param {string} channel channel
     * @param {Object} responseApi resputa del legado
     * @returns {Object} ISKUSond objeto del microservicio
     */
    objetoResponse(channel, responseApi) : ISKUSond{
        return  {
            ...channel,
            productConfiguration:{
                contextCharacteristic:{
                    '@type':servicesConfig["contextCharacteristic/@type"],
                    'name':servicesConfig["contextCharacteristic/name"],
                    value: {
                        '@type': servicesConfig["value/@type"],
                        childMaterial: responseApi.data.materialHijo,
                        parentMaterial: responseApi.data.materialPadre,
                        parentMaterialDescription: responseApi.data.materialPadreDescription,
                        articleGroup: responseApi.data.articleGroup,
                        articleGroupDescription: responseApi.data.articleGroupDescription,
                        materialType: responseApi.data.materialType,
                        materialTypeDescription: responseApi.data.materialTypeDescription,
                        brand: responseApi.data.brand,
                        productCost: responseApi.data.productCost,
                        length: responseApi.data.length,
                        width: responseApi.data.width,
                        height: responseApi.data.height,
                        weight: responseApi.data.weight
                    }
                }
            }
        } as ISKUSond
    }

    /**
     * Valida el resultado del legado
     * @param {Object} response resultado de la api
     */
    responseErrorMessage(response){
        throw new BusinessException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            EmessageMapping.BAD_REQUEST,
            true,
            undefined,
            response?.data?.message,
            response?.data?.statusCode
        );
    }
}