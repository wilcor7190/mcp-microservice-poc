/**
 * clase que nicia el proceso de transformacion PRECIOS sobre la colleccion
 * @author Deivid Santiago Vargas
 */
import { Injectable } from "@nestjs/common";
import { FamilyParams } from "src/common/utils/enums/params.enum";
import { ITransformPricesUc } from '../transform-prices.uc';
import { TypeParams, ValuesParams } from '../../../../common/utils/enums/params.enum';
import { IServiceTracingUc } from "../../resource/service-tracing.resource.uc";
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from "src/common/utils/enums/tracing.enum";
import generalConfig from "src/common/configuration/general.config";
import Logging from "src/common/lib/logging";
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { IPriceProvider } from "src/data-provider/provider/prices/price.provider";
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { IPricesProductOfferingUC } from "../product-offering-prices.uc";

let pricesEqu = {
    params: {
        family: FamilyParams.equipment,
        type: TypeParams.price,
        page: 1,
    },
    data: {
        getProductOfferingResponse: []
    }
};

let pricesTech = {
    params: {
        family: FamilyParams.technology,
        type: TypeParams.price,
        page: 1,
    },
    data: {
        getProductOfferingResponse: []
    }
};

let numPageEqu = 1;
let numPageTech = 1;
let existEqu = false;
let existTec = false;
let deleteTec = true;
let deleteEqu = true;


@Injectable()
export class TransformPricesUc implements ITransformPricesUc {
    private readonly logger = new Logging(TransformPricesUc.name);
    constructor(
        private readonly _priceProvider: IPriceProvider,
        private readonly _pricesProductOfferingUC: IPricesProductOfferingUC,
        public readonly _GetErrorTracing: IGetErrorTracingUc,
        public readonly _serviceTracing: IServiceTracingUc,

    ) { }

    startVariables() {
        numPageEqu = 1;
        numPageTech = 1;
        existEqu = false;
        existTec = false;
        deleteEqu = true;
        deleteTec = true;

        pricesEqu = {
            params: {
                family: FamilyParams.equipment,
                type: TypeParams.price,
                page: 1
            },
            data: {
                getProductOfferingResponse: []
            }
        }

        pricesTech = {
            params: {
                family: FamilyParams.technology,
                type: TypeParams.price,
                page: 1,
            },
            data: {
                getProductOfferingResponse: []
            }
        }
    }

    /**
     * metodo para la transformacion de precios se le manda la colleccion , si es equipo o technology y la familia
     * @param {string}collection el objeto que viene de la base de datos 
     * @param {string}isEquip boolean si es equipo o technologia para hacer la consulta
     * @param {string}family se le manda la familia para anexarla al objeto
     */
    async transformPrices(collection: string, isEquip: string, family: string): Promise<any> {
        this.logger.write(`Inicia el proceso de transformacion PRECIOS sobre la colleccion ${collection}`, Etask.FIND_JOINPRICESPRICES);
        try {
            let filter = "PO_Equ";
            let individualPrice
            (isEquip === "Tecnologia") && (filter = "PO_Tec");

            // se hace una consulta general de tecnologia y terminales  para validar que existan las caracteristicas 
            let allPrices = await this._priceProvider.getJoinPricesFeatures(collection, filter);

            for (let price of allPrices) {

                const individualPriceEqu = [
                    {
                        popType: 'PrecioVentaOne-Time',
                        price: {
                            amount: price['Precio_IVA_Final'] 
                        }
                    },
                    {
                        popType: 'PrecioBaseOne-Time',
                        price: {
                            amount: price['Precio_sin_IVA']
                        }
                    },
                    {
                        popType: 'ImpuestoIVA',
                        price: {
                            amount: price['Precio_impuestoIva']
                        }
                    }

                ]

                const individualPriceTec = individualPriceEqu
                if (isEquip === "Tecnologia") {
                    individualPrice = individualPriceTec
                } else {
                    individualPrice = individualPriceEqu
                }
                let productOfferingPrices = {
                    productOfferingPrices: [{
                        id: `${filter}${price.Equipo}`,
                        versions: individualPrice
                    }],
                    family
                }

                let offPrices = {
                    versions: []
                }
                offPrices['id'] = `${filter}${price.Equipo}`;
                offPrices.versions[0] = productOfferingPrices;

                if (filter == 'PO_Equ') {
                    pricesEqu.data.getProductOfferingResponse.push(offPrices);
                    existEqu = true;
                } else {
                    pricesTech.data.getProductOfferingResponse.push(offPrices);
                    existTec = true;
                }
            }


            await this._pricesProductOfferingUC.deleteDataColPrtProductOffering(family);
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
                EDescriptionTracingGeneral.EQU_COLL_COLPRTPRODUCTOFFERING, ETaskTracingGeneral.DELETE_DATA);

        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.START_PRICES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
            this.logger.write('transformPrices()' + error.stack, Etask.FIND_JOINPRICESPRICES, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.FIND_JOINPRICESPRICES, ETaskDesc.ERROR_DATA);
            await this._GetErrorTracing.getError(error);
        }
    }

    /**
     * Metodo para insertar el objeto paginado 
     * @param typeG objeto para saber si son equipos o tecnologia
     */
    async paginationDB(typeG: ValuesParams): Promise<any> {

        try {
            let objectPrices = [];
            let price;
            if (typeG == ValuesParams.PRICESEQU) {
                objectPrices = pricesEqu.data.getProductOfferingResponse;
                price = JSON.parse(JSON.stringify(pricesEqu));
            } else if (typeG == ValuesParams.PRICESTEC) {
                objectPrices = pricesTech.data.getProductOfferingResponse;
                price = JSON.parse(JSON.stringify(pricesTech));
            }

            let division = generalConfig.paginationDB;
            let sizeArray = objectPrices.length;
            let i = 0;

            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
                EDescriptionTracingGeneral.STA_PRICES_COLL_COLPRTPRODUCTOFFERING, ETaskTracingGeneral.SAVE_DATA);

            while (i < sizeArray) {
                let chunckPre = objectPrices.slice(i, i + division);
                price.data.getProductOfferingResponse = chunckPre;
                price.params.page = (typeG == "pricesEqu") ? numPageEqu : numPageTech;
                await this._pricesProductOfferingUC.saveTransformData(price);
                i += division;
                (typeG == "pricesEqu") ? numPageEqu++ : numPageTech++;
            }

            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
                EDescriptionTracingGeneral.FIN_PRICES_COLL_COLPRTPRODUCTOFFERING, ETaskTracingGeneral.SAVE_DATA);


        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.FIN_PRICES_COLL_COLPRTPRODUCTOFFERING, ETaskTracingGeneral.SAVE_DATA);
            this.logger.write('paginationDB() ' + error.tasks, Etask.ERROR_TRANSFORM_PRICES_EQU_TECH, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.DOWNLOAD_FILE, ETaskDesc.DOWNLOAD_FILE);
            await this._GetErrorTracing.getError(error);
        }

    }

    extraindividualPriceEqu() {
        let price
        return [
            {
                popType: 'PrecioVentaOne-Time',
                price: {
                    amount: price['Precio_IVA_Final'] 
                }
            },
            {
                popType: 'SalesPriceWithoutDiscount',
                price: {
                    amount: price['Precio_sin_descuento']
                }
            },
            {
                popType: 'PrecioBaseOne-Time',
                price: {
                    amount: price['Precio_sin_IVA']
                }
            },
            {
                popType: 'BasePriceWithDiscount',
                price: {
                    amount: price['Precio_Base_descuento']
                }
            },
            {
                popType: 'ImpuestoIVA',
                price: {
                    amount: price['Precio_impuestoIva']
                }
            },
            {
                popType: 'IVAWithoutDiscount',
                price: {
                    amount: price['Iva_sinDescuento']
                }
            }
        ]
    }

}