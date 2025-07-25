/**
 * clase carga los precios
 * @author Juan Gabriel Garzon
 */

import { Injectable } from '@nestjs/common';
import Logging from 'src/common/lib/logging';
import { ISftpManagerProvider } from 'src/data-provider/provider/downloadFile/sftp-manager.provider';
import { IFileManagerProvider } from 'src/data-provider/provider/downloadFile/file-manager.provider';
import { IGetDataPricesUc } from '../get-data-prices.uc';
import { IParamProvider } from 'src/data-provider/param.provider';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { ITransformPricesUc } from '../transform-prices.uc';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import encontrar from 'src/common/utils/assets/UtilConfig';
import { IPriceProvider } from 'src/data-provider/provider/prices/price.provider';
import { CollectionsNames } from 'src/common/utils/enums/collectionsNames.enum';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { ValuesParams, FamilyParams } from "src/common/utils/enums/params.enum";
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { BusinessException } from 'src/common/lib/business-exceptions';


@Injectable()
export class GetDataPricesUc implements IGetDataPricesUc {


    constructor(
        private readonly _transformPricesUC: ITransformPricesUc,
        private readonly _pricesProvider: IPriceProvider,
        private readonly _sftpManagerProvider: ISftpManagerProvider,
        private readonly _fileManagerProvider: IFileManagerProvider,
        private readonly _parmProvider: IParamProvider,
        public readonly _GetErrorTracing: IGetErrorTracingUc,

    ) { }

    private readonly logger = new Logging(GetDataPricesUc.name);

    /**
     * Metodo para consultar y descargar los archivos de un servidor sftp y procesar  la informacion
     * @param {boolean}deleteData boolean que se utiliza para saber si es necesario borrar la base de datos antes de hacer otra carga
     * @returns {boolean} si completo el proceso o no
     */
    async getSftpFiles(): Promise<any> {

        try {
            const params: any = (await this._parmProvider.getParamByIdParam(ValuesParams.TERTEC_PRICES))
            const pathFiles = params.values.filter((file: any) => file.status)

            for (const pathFile of pathFiles) {
                try {
                    this.logger.write('getSftpFiles() NEXT FILE ', Etask.START_PROCESS);
                    const remotePath: string = pathFile.remotePath;
                    const putPath: string = pathFile.putPath;
                    const localPath: string = await encontrar.getCsv(pathFile.nameFile.replace('.txt', ''));

                    const isEquip = pathFile.category;
                    const dateTimeNow = new Date();
                    const loadTime = this.obtenLoadTime(pathFile.loadTime);
                    const family = this.obtenFamily(pathFile.family);

                    await this._sftpManagerProvider.download({
                        remotePath, 
                        localPath, 
                        loadTime,
                        namelocalFile: pathFile.nameFile,
                    });


                    // Eliminacion de colecciones
                    await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
                        EDescriptionTracingGeneral.DATA_PRICES, ETaskTracingGeneral.DELETE_DATA);
                    await this._pricesProvider.deletePricesCollections(family);
                    await this._parmProvider.setLoadTime(ValuesParams.TERTEC_PRICES);

                    const NAME_COLLECTION = this.getNameCollection(family);

                    /*
                    toma el isShort desde la colleccion params, si tiene true procece a mandar estos headers al obtener el file  modificado
                    pero se deberia quitar ya que debe tomar los headers del file 
                    */
                    const headers = [];
                    const content = await this._fileManagerProvider.getDataCsv(localPath, headers, '|');
                    await this.saveDataBD(content, family, NAME_COLLECTION);
                    await this._sftpManagerProvider.writeFile(putPath, localPath)
                    await this._fileManagerProvider.deleteFile(localPath)
                    pathFile.loadTime = dateTimeNow;

                    await this._transformPricesUC.transformPrices(NAME_COLLECTION, isEquip, family);

                    if (family === FamilyParams.technology) {
                        await this._transformPricesUC.paginationDB(ValuesParams.PRICESTEC);
                    } else {
                        await this._transformPricesUC.paginationDB(ValuesParams.PRICESEQU);
                    }
                    this._transformPricesUC.startVariables();
                    await this._parmProvider.updateParam(pathFiles)
                    this.logger.write(`Fin del proceso - Prices flujo: ${family}`, Etask.TRANSFORM_FILE);

                } catch (error) {
                    this.logger.write('Error en descarga y transformacion flujo: ' + pathFile.family, Etask.TRANSFORMDATA, ELevelsErros.WARNING)
                }

            }
            this.logger.write('Fin proceso prices (Terminales y Tecnologia) ' , Etask.TRANSFORMDATA, ELevelsErros.INFO)

        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.START_PRICES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
            this.logger.write('getSftpFiles() ' + error.tasks, Etask.TRANSFORMDATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            await this._GetErrorTracing.getError(error);
            throw new BusinessException()
        }
    }

    /**
     * se utilizo este metodo para reducir la complejidad para temas de sonar
     * de acuerdo al nameFile regresa en nombre de la coleccion a consultar o insertar
     * @param {string} nameFile 
     * @returns  nombre de la coleccion
     */
    private getNameCollection = (family: FamilyParams): string => {
        try {
            switch (family) {
                case FamilyParams.TerLibres:
                    return CollectionsNames.TERMINALES_LIBRES

                case FamilyParams.kitprepago:
                    return CollectionsNames.TERMINALES_KIT_PREPAGO

                case FamilyParams.technology:
                    return CollectionsNames.TECNOLOGIA;
                default:
                    this.logger.write('No se encontro la base de datos - Precios ', Etask.TRANSFORMDATA, ELevelsErros.WARNING)
                    return null
            }
        } catch (error) {
            this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.DATA_PRICES, ETaskTracingGeneral.FILE_TRANSFORM);
            this.logger.write('getNameCollection() ' + error.tasks, Etask.TRANSFORMDATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
            this._GetErrorTracing.getError(error);

        }

    }


    /**
     * se agrega la familia el contenido  y posterior se inserta en las colecciones temporales
     * @param {*}content data a guadar
     * @param {string}family flujo 
     * @param {string}nameCollection nombre de la coleccion 
     * @returns {boolean} si la data se guarda o no
     */
    private saveDataBD = async (content: any, family: string, nameCollection: string): Promise<any> => {

        /* se le agrega la familia a la tabla para todos los elementos de la colleccion*/
        try {
            for (const item of content) {
                item.family = family;
            }
            this.logger.write(`Guardando precios en la base de datos `, Etask.START_PROCESS_PRICESEQUIPOS);

            await this._fileManagerProvider.saveDataTemporalCollection(nameCollection, content);

            return true;
        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.DATA_PRICES, ETaskTracingGeneral.SAVE_DATA);
            this.logger.write('saveDataBD() ' + error.tasks, Etask.SAVE_DATA, ELevelsErros.ERROR)
            utils.assignTaskError(error, Etask.SAVE_DATA, ETaskDesc.SAVE_DATA);
            await this._GetErrorTracing.getError(error);
        }

    }


    /**
     * se utiliza para reducir la complejidad del servicio, se obtiene la ultima vez que fue cargado el servicio
     * @param {*}loadTime objeto que se usa para validar si ya fue cargado anteriormente el servicio
     * @returns 
     */
    private obtenLoadTime(loadTime: any) {
        if (loadTime) {
            return loadTime
        }
        else {
            return 0
        }
    }

    /**
     * funcion para obtener la familia desde la coleccion params
     * @param {*}family 
     * @returns 
     */
    private obtenFamily(family: any) {
        if (family) {
            return family;
        }
        else {
            return null;
        }

    }

}