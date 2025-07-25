/**
 * clase para la manipulacion y transformacion de archivos de manager-provider
 * * @author Jose Daniel Orellana
 */
import { Injectable } from '@nestjs/common';
import Logging from 'src/common/lib/logging';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { IFileManagerProvider } from '../file-manager.provider';
import DbConnection from 'src/common/utils/dbConnection';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { BusinessException } from 'src/common/lib/business-exceptions';

const fs = require("fs")
const csvjson = require('csvtojson')


@Injectable()
export class FileManagerProvider implements IFileManagerProvider {

    constructor(
        public readonly _GetErrorTracing: IGetErrorTracingUc,

    ) {
        //Constructor vacio
    }

    private readonly logger = new Logging(FileManagerProvider.name);

    /**
     * Metodo que transforma un csv a json
     * @param {string}fileRoot fichero
     * @param {string}delimiter delimitador a usar 
     * @returns json object
     */
    async getDataCsvHeader(fileRoot: string, delimiter: string): Promise<any> {
        return csvjson({
            delimiter
        }).fromFile(fileRoot)

    }

    /**
     * metodo que ayuda a la eliminacion de un archivo descargado desde el sftp
     * @param csvRoot ruta del archivo
     * @returns si se borro o no
     */
    async deleteFile(csvRoot: string): Promise<any> {
        return new Promise(async resolve => {
            try {
                if (await fs.existsSync(csvRoot)) {
                    const path = csvRoot;
                    await fs.unlinkSync(path);
                    this.logger.write('deleteFile() eliminando antiguo archivo', Etask.REMOVE, ELevelsErros.INFO);
                    resolve('FileDeleted')
                }
                resolve('FileDeleted')
            } catch (error) {
                await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                    EDescriptionTracingGeneral.NO_FILE, ETaskTracingGeneral.DELETE_DATA);
                this.logger.write('deleteFile()' + error.stack, Etask.REMOVE, ELevelsErros.ERROR);
                utils.assignTaskError(error, Etask.REMOVE, ETaskDesc.REMOVE);
                await this._GetErrorTracing.getError(error);
            }
        });
    }

    async getDataCsv(fileRoot: string, headers: string[], delimiter: string): Promise<any> {
        try {
            this.logger.write('Iniciando lectura del archivo CSV', Etask.START_READ_FILE, ELevelsErros.INFO);

            if (!fs.existsSync(fileRoot)) {
                throw new BusinessException(404, `El archivo ${fileRoot} no existe`, false);
            }

            const data = await csvjson({ delimiter }).fromFile(fileRoot);

            this.logger.write('Archivo CSV leído correctamente', Etask.FINISHED_READ_FILE, ELevelsErros.INFO);
            return data;

        } catch (error) {
            await this._GetErrorTracing.createTraceability(
                EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.FILE_PROCESS,
                ETaskTracingGeneral.FILE_TRANSFORM
            );
            this.logger.write('Error en getDataCsv: ' + error.message, Etask.ERROR_DATA, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.ERROR_DATA, ETaskDesc.ERROR_FILEDATA);
            await this._GetErrorTracing.getError(error);
            throw error;
        }
    }


    /**
     * metodo que guarda en la coleccion especifica los datos 
     * @param nameCollection nombre de la coleccion de mongo
     * @param content contenido a insertar en la BD
     */
    async saveDataTemporalCollection(nameCollection: string, content: any): Promise<void> {
        /* cerrar conexion*/
        const { client, db } = await DbConnection.dbConnection();
        try {

            const START_TIME = process.hrtime();
            const collection = db.collection(nameCollection);
            await collection.insertMany(content);
            const processingTime = this.processExecutionTime(START_TIME);
            this.logger.write(`Guardando data en ${nameCollection}`, Etask.SAVE_DATA, ELevelsErros.INFO, nameCollection, '', processingTime);

        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.SAVE_DATA_COLECCTIONS, ETaskTracingGeneral.SAVE_DATA);
            this.logger.write(' Error saveDataTemporalCollection()' + error, Etask.SAVE_DATA, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.SAVE_DATA, ETaskDesc.SAVE_DATA);
            await this._GetErrorTracing.getError(error);
        } finally {
            await client.close();
        }
    }

    /**
     * metodo que guarda en la coleccion especifica los datos 
     * @param nameCollection nombre de la coleccion de mongo
     * @param content contenido a insertar en la BD
     */
    async saveDataTemporalCollectionHomes(nameCollection: string, content: any): Promise<void> {
        const { client, db } = await DbConnection.dbConnection();
        try {
            const collection = db.collection(nameCollection);
            await collection.insertMany(content);

        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
                EDescriptionTracingGeneral.DATA_PRICES, ETaskTracingGeneral.SAVE_DATA);
            this.logger.write(' Error saveDataTemporalCollectionHomes()' + error, Etask.ERROR_SAVEDATA_HOMEATTRIBUTESPRICES, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.SAVE_DATA, ETaskDesc.SAVE_DATA);
            await this._GetErrorTracing.getError(error);
        } finally {
            await client.close();
        }

    }



    /**
    * Función para generar log informativo para el services provider de Message
    * @param {any} startTime cadena fecha inicio consulta bd
    */
    processExecutionTime(startTime: any): number {
        const endTime = process.hrtime(startTime);
        return Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
    }

}
