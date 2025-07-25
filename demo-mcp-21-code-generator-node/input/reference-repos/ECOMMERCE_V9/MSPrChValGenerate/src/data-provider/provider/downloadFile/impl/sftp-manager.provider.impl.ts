/**
 * clase para la carga de archivos sftp
 * * @author Juan Gabriel Garzon
 */
import { HttpStatus, Injectable } from '@nestjs/common';
import { ISftpManagerProvider } from '../sftp-manager.provider';
import generalConfig from 'src/common/configuration/general.config';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import Logging from 'src/common/lib/logging';
import Client = require('ssh2-sftp-client');
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from 'src/common/utils/enums/tracing.enum';
import { dirname } from 'path';
import { IDownload } from '../../../../core/entity/downloadsftp/download.entity';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { BusinessException } from 'src/common/lib/business-exceptions';

const fs = require("fs")
let upNameFile;

@Injectable()
export class SftpManagerProvider implements ISftpManagerProvider {

    constructor(
        public readonly _GetErrorTracing: IGetErrorTracingUc,
        ) { }


    private readonly logger = new Logging(SftpManagerProvider.name);


    /**
     * Funcion para extraer el archivo del sftp y descargar en local para Terminales y Tecnologia
     * @param {string}remotePath ubicacion del archivo en el sftp
     * @param {string}localPath ubicacion local donde se descarga el sftp
     * @param {Date}loadTime fecha y hora de la carga del archivo
     * @returns {Boolean} Si se descargo o no
     */
    async download(
        paramsDownload: IDownload

    ): Promise<void> {
        this.logger.write('download', Etask.DOWNLOAD_FILE);
        const { remotePath, localPath, loadTime, namelocalFile } = paramsDownload
        let conn = new Client();
        try {
            await conn.connect({
                host: generalConfig.sftpModuleHost,
                port: Number(generalConfig.sftpModulePort),
                username: generalConfig.sftpModuleUsername,
                password: generalConfig.sftpModulePassword
            }) 

            const exist = await conn.exists(remotePath);
    
            // List files in a directory
            const files = await conn.list(remotePath);

            // validacion si el archivo existe
            const file = files.filter((fileocupado) => fileocupado.type === "-")
            if (exist && file.length != 0) {

                //Filtrar el archivo mas reciente 
                let fileName;   
                const validFilesPrices = file.filter((nameFile) => nameFile.name.includes(namelocalFile));
                const otherFile = file.find(fileItem => fileItem.name === namelocalFile);
                if (otherFile != undefined) {
                    fileName = otherFile.name
                } else if (validFilesPrices.length != 0) {
                    fileName = await this.findFile(validFilesPrices)
                }
                upNameFile = fileName

                if (fileName === undefined || fileName === null) {
                    this.logger.write('donwload() el archivo no fue encontrado' + remotePath, Etask.DOWNLOAD_FILE, ELevelsErros.WARNING);
                    //FALTA ARCHIVO
                    await this._GetErrorTracing.createTraceability(
                        EStatusTracingGeneral.STATUS_FAILED,
                        `${EDescriptionTracingGeneral.REPEATED_FILE} - Ruta: ${remotePath}${fileName}, Fecha: ${new Date(loadTime)}`, ETaskTracingGeneral.SAVE_DATA);
                    throw new BusinessException(HttpStatus.CREATED,'donwload() el archivo no fue encontrado' + remotePath, false)
                    // omite descarga y carga
                }
                // valiacion de fecha creacion File (ftp) vs carga en mongo
                const { modifyTime } = await conn.stat(`${remotePath}${fileName}`);

                if (new Date(modifyTime) < loadTime) {
                    this.logger.write('download() el archivo ya fue cargado en el dia' + loadTime, Etask.CREATE, ELevelsErros.WARNING);
                    this.logger.write('ruta ' + `${remotePath}${fileName}`, Etask.CREATE, ELevelsErros.WARNING);
                    //FALTA ARCHIVO
                    await this._GetErrorTracing.createTraceability(
                        EStatusTracingGeneral.STATUS_FAILED,
                        `${EDescriptionTracingGeneral.REPEATED_FILE} - Ruta: ${remotePath}${fileName}, Fecha: ${new Date(loadTime)}`, ETaskTracingGeneral.SAVE_DATA);
                    throw new BusinessException(HttpStatus.CREATED,'download() el archivo ya fue cargado en el dia' + loadTime, false)
                    // omite descarga y carga 
                }
                this.logger.write('Descargando archivo '+ fileName, Etask.DOWNLOAD_FILE);
                await conn.fastGet(`${remotePath}${fileName}`, localPath);
                await this._GetErrorTracing.createTraceability(
                    EStatusTracingGeneral.STATUS_SUCCESS,
                    `${EDescriptionTracingGeneral.SAVE_FILE} - Ruta: ${remotePath}${fileName}`, ETaskTracingGeneral.SAVE_DATA);
                
            } else {

                this.logger.write('donwload() el archivo no fue encontrado' + remotePath, Etask.DOWNLOAD_FILE, ELevelsErros.WARNING);
                await this._GetErrorTracing.createTraceability(
                    EStatusTracingGeneral.STATUS_FAILED,
                    `${EDescriptionTracingGeneral.NO_FILE} - Ruta: ${remotePath}`, ETaskTracingGeneral.SAVE_DATA);
                throw new BusinessException()
            }
        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
                EDescriptionTracingGeneral.START_FEATURES_LOAD_PROCESS, ETaskTracingGeneral.FILE_DOWNLOAD);
            utils.assignTaskError(error, Etask.DOWNLOAD_FILE, ETaskDesc.DOWNLOAD_FILE);
            this.logger.write(`download() Hubo una falla al descargar el archivo ${namelocalFile} -> ` + error, Etask.DOWNLOAD_FILE, ELevelsErros.ERROR);
            await this._GetErrorTracing.getError(error);
            throw error
        }finally{
            await conn.end()
        }
        
    }

    async downloadMovHom(
        remotePath: string,
        localPath: string,
        loadTime: Date,
        nameFile: string
    ): Promise<boolean> {
        this.logger.write('download', Etask.DOWNLOAD_FILE);

        let conn = new Client();

        try {

            await conn.connect({
                host: generalConfig.sftpModuleHost,
                port: Number(generalConfig.sftpModulePort),
                username: generalConfig.sftpModuleUsername,
                password: generalConfig.sftpModulePassword
            })

            // validacion si el archivo existe
            const exist = await conn.exists(remotePath);
            if (exist) {
                const files = await conn.list(remotePath)
                const file = files.find(fileItem => fileItem.name === nameFile);
                const fileName = file.name;

                // valiacion de fecha creacion File (ftp) vs carga en mongo
                const { modifyTime } = await conn.stat(`${remotePath}${fileName}`);

                if (new Date(modifyTime) < loadTime) {
                    this.logger.write('download() el archivo ya fue cargado en el dia' + loadTime, Etask.CREATE, ELevelsErros.INFO);
                    this.logger.write('ruta ' + `${remotePath}${fileName}`, Etask.CREATE, ELevelsErros.INFO);
                    //FALTA ARCHIVO
                    await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_FAILED,
                    `${EDescriptionTracingGeneral.REPEATED_FILE} - Ruta: ${remotePath}${fileName}, Fecha: ${new Date(loadTime)}`, ETaskTracingGeneral.SAVE_DATA);
                    return false; // omite descarga y carga
                }
                await conn.fastGet(`${remotePath}${fileName}`, localPath);
                await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
                `${EDescriptionTracingGeneral.SAVE_FILE} - Ruta: ${remotePath}${fileName}`, ETaskTracingGeneral.SAVE_DATA);
                return true;
            } else {

                this.logger.write('donwload() el archivo no fue encontrado' + remotePath, Etask.DOWNLOAD_FILE, ELevelsErros.WARNING);
                await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_FAILED,
                `${EDescriptionTracingGeneral.NO_FILE} - Ruta: ${remotePath}`, ETaskTracingGeneral.SAVE_DATA);
            }
        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
                EDescriptionTracingGeneral.START_FEATURES_LOAD_PROCESS, ETaskTracingGeneral.FILE_DOWNLOAD);
            this.logger.write(`download() Hubo una falla al descargar el archivo` + error.tasks, Etask.DOWNLOAD_FILE, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.DOWNLOAD_FILE, ETaskDesc.DOWNLOAD_FILE);
            await this._GetErrorTracing.getError(error);
            return false;

        }finally{
            await conn.end()
        }
    }

    /**
     * Funcion para escribir o cargar el archivo volcado en el sftp para el caso de precios de terminales y tecnologia
     * @param putPath Ubicacion para cargar el archivo en el sftp
     * @param localPath Ubicacion del archivo volcado
     * @param dateTimeNowCarac Fecha y hora del volcado del archivo de caracteristicas en la base de datos
     * @returns {Boolean}Si se cargo el archivo o no
     */
    async writeFile(
        putPath: string,
        localPath: string,
        dateTimeNowCarac?:string
    ): Promise<boolean> {

        this.logger.write('write', Etask.WRITE_FILE);
        let conn = new Client();
        const nameFileUp = upNameFile == 'carac_mat_sap.json' ? upNameFile+dateTimeNowCarac+ '.done' : upNameFile + '.done';
        const remoteFilePath = putPath + "/" + nameFileUp
        try {
            await conn.connect({
                host: generalConfig.sftpModuleHost,
                port: Number(generalConfig.sftpModulePort),
                username: generalConfig.sftpModuleUsername,
                password: generalConfig.sftpModulePassword
            })
            const fileReadStream = fs.createReadStream(localPath);
            const remoteDirectory = dirname(remoteFilePath);
            await conn.mkdir(remoteDirectory, true);
            const put = await conn.put(fileReadStream, remoteFilePath);
            if (put) {
                await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
                `${EDescriptionTracingGeneral.WRITE_FILE} - Ruta: ${remoteFilePath}`, ETaskTracingGeneral.SAVE_DATA);
                return true;
            } else {
                this.logger.write('writeFile() el archivo no fue cargado' + remoteFilePath, Etask.DOWNLOAD_FILE, ELevelsErros.WARNING);
                await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_FAILED,
                `${EDescriptionTracingGeneral.NO_WRITE_FILE} - Ruta: ${remoteFilePath}`, ETaskTracingGeneral.SAVE_DATA);
                return false;
            }
        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
                EDescriptionTracingGeneral.NO_WRITE_FILE, ETaskTracingGeneral.SAVE_DATA);
            this.logger.write(`writeFile()` + error.tasks, Etask.WRITE_FILE, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.WRITE_FILE, ETaskDesc.WRITE_FILE);
            await this._GetErrorTracing.getError(error);

        }finally{
            await conn.end()
        }
    }

    /**
     * Metodo para encontrar la fecha mas reciente del archivo sftp para precios
     * @param {Array}dates Arreglo con las fechas encontradas
     * @returns Fecha mas reciente
     */
    async findDate(dates: any) {
        let orderDates = dates.sort();
        let lastDate = orderDates.slice(-1);
        return lastDate.toString();

    }

    async findFile(validFiles: any) {
        try {
            let fileName;
            const datesFormat = []
            validFiles.forEach(nameFile => {
                let formatName = nameFile.name.replace(/_/g, "")
                let findDate = formatName.indexOf("20")
                let date = formatName.slice(findDate, -1)
                let year = date.slice(0, 4);
                let month = date.slice(4, 6);
                let day = date.slice(6, 8);
                let hour = date.slice(8, 10);
                let minute = date.slice(10, 12);
                let segund = date.slice(12, 14);
                let joinDate = year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + segund
                datesFormat.push(joinDate)
            });
            let limitDates = []
            datesFormat.forEach((date) => {
                let systemDate = new Date().toISOString()
                let limit = date.indexOf(" ")
                let dateFile = date.slice(0, limit)
                let actualDate = systemDate.slice(0, limit)
                if (dateFile <= actualDate) {
                    limitDates.push(date)
                }
            })
            const recentDate = await this.findDate(limitDates)
            let fileDate = new Date(recentDate).toLocaleDateString()
            let sysDate = new Date().toLocaleDateString();
            if (fileDate == sysDate) {
                const dateFormat = recentDate.replace(/[^a-zA-Z0-9 ]/g, '');
                const finalDate = dateFormat.replace(/\s/g, '_');
                validFiles.filter(nameFile => {
                    let existFile = nameFile.name.includes(finalDate)
                    if (existFile) { fileName = nameFile.name; }
                })
                return fileName
            } else {
                this.logger.write('donwload() los archivos no son del dia actual de ejecucion ' + new Date().toISOString(), Etask.DOWNLOAD_FILE, ELevelsErros.WARNING);
                await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_FAILED,
                `${EDescriptionTracingGeneral.NO_FILE} - los archivos no son del dia actual de ejecucion`, ETaskTracingGeneral.SAVE_DATA);

            }
        } catch (error) {
            await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR, 
                EDescriptionTracingGeneral.START_MANUAL_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
            this.logger.write(`findFile() Error buscando el archivo` + error.tasks, Etask.FIND_DATE, ELevelsErros.ERROR);
            utils.assignTaskError(error, Etask.FIND_DATE, ETaskDesc.FIND_DATE);
            await this._GetErrorTracing.getError(error);
        }
    }

 
}