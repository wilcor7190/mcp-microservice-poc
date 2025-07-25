/**
 * Clase para manejar las caracteristicas del sftp
 * @author Deivid Santiago Vargas
 */
import { Injectable } from '@nestjs/common';
let fs = require('fs')
let readline = require('readline')
import Logging from 'src/common/lib/logging';
import encontrar from 'src/common/utils/assets/UtilConfig';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral, } from 'src/common/utils/enums/tracing.enum';
import { IFileManagerProvider } from 'src/data-provider/provider/downloadFile/file-manager.provider';
import { IParamProvider } from 'src/data-provider/param.provider';
import { ISftpManagerProvider } from 'src/data-provider/provider/downloadFile/sftp-manager.provider';
import { IGetDataFeaturesUc } from '../get-data-features.uc';
import { ELevelsErros } from "src/common/utils/enums/logging.enum";
import utils from 'src/common/utils/GeneralUtil';
import { ValuesParams } from "src/common/utils/enums/params.enum";
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { ICatalogUc } from '../../catalog/catalog.uc';


@Injectable()
export class GetDataFeaturesUc implements IGetDataFeaturesUc {
  private readonly logger = new Logging(GetDataFeaturesUc.name);

  constructor(
    private readonly _catalogProvider: ICatalogUc,
    private readonly _sftpManagerProvider: ISftpManagerProvider,
    private readonly _fileManagerProvider: IFileManagerProvider,
    private readonly _parmProvider: IParamProvider,
    public readonly _GetErrorTracing: IGetErrorTracingUc,
  ) { }



  /**
   * Funcion para hacer la carga de los documentos a un sftp, lee la colleccion de params 
   * y obtiene un csv del sftp para ser volcado a las diferentes colecciones en este caso features
   * @returns {boolean} si completo el proceso o no
   */
  async getSftpFiles(): Promise<any> {
    try {

      await this.getSftpSku();
      await this.getSftptyc();

      const pathFile: any = await this._parmProvider.getParamByIdParam(ValuesParams.TERTEC_ATRTIBUTES);

      const remotePath: string = pathFile.values.remotePath;
      const localPath: string = await encontrar.getJson(pathFile.values.nameFile.replace('.json', ''));
      const putPath: string = pathFile.values.putPath;
      const loadTime = pathFile.values.loadTime || 0;

      await this._sftpManagerProvider.download({
        remotePath,
        localPath,
        loadTime,
        namelocalFile: pathFile.values.nameFile,
      });

      // Limpieza de toda la coleccion
      await this._catalogProvider.deleteAttributes();

      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
        EDescriptionTracingGeneral.DATA_FEATURES, ETaskTracingGeneral.DELETE_DATA);

      await this.transformFile2(localPath);

      // Actualizacion de fecha y hora en la carga de parms
      const dateTimeNow = new Date();
      pathFile.values.loadTime = dateTimeNow;

      await this._parmProvider.updateParam(pathFile); 

      await this.saveFileCharacteristics(dateTimeNow, localPath, putPath);


    } catch (error) {
      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
      this.logger.write('getSftpFiles() -> ' + error, Etask.ERROR_DATA, ELevelsErros.ERROR)
      utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
      await this._GetErrorTracing.getError(error);
      throw error
    }
  }


  /**
   * Funcion para hacer la carga de los documentos a un sftp, lee la colleccion de params 
   * y obtiene un csv del sftp para ser volcado a las diferentes colecciones
   * @returns {boolean} si completo el proceso o no
   */
  async getSftpSku(): Promise<any> {
    try {
      const pathFile: any = await this._parmProvider.getParamByIdParam(ValuesParams.EXCEPTION);

      const remotePath: string = pathFile?.values?.remotePath;
      const localPath: string = await encontrar.getJson(pathFile?.values?.nameFile.replace('.json', ''));
      const loadTime = pathFile?.values?.loadTime || 0;

      await this._sftpManagerProvider.download({
        remotePath,
        localPath,
        loadTime,
        namelocalFile: pathFile.values.nameFile,
      });

      await this._catalogProvider.deleteExceptionSkus();

      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
        EDescriptionTracingGeneral.DATA_EXCEPTIONS, ETaskTracingGeneral.DELETE_DATA);

      const headers = [];

      const content = await this._fileManagerProvider.getDataCsv(localPath, headers, ' ');

      if (content.length == 0) {
        this.logger.write('getSftpSku() - No se encontro data en el archivo', Etask.ERROR_DATA, ELevelsErros.WARNING)
        return
      }

      await this._catalogProvider.saveExceptionSkus(content)

      await this._fileManagerProvider.deleteFile(localPath);
    } catch (error) {
      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
      this.logger.write('getSftpSku() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR);
      utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
      await this._GetErrorTracing.getError(error);
    }
  }

  /**
   * Funcion para hacer la carga de los documentos a un sftp, lee la colleccion de params 
   * y obtiene un csv del sftp para ser volcado a las diferentes colecciones
   * @returns {boolean} si completo el proceso o no
   */
  async getSftptyc(): Promise<any> {
    try {
      const pathFile: any = await this._parmProvider.getParamByIdParam(ValuesParams.TERMCOND);

      const remotePath: string = pathFile?.values?.remotePath;
      const putPath: string = pathFile.values?.putPath;
      const localPath: string = await encontrar.getJson(pathFile?.values?.nameFile.replace('.csv', ''));
      const loadTime = pathFile?.values?.loadTime || 0;

      await this._sftpManagerProvider.download({
        remotePath,
        localPath,
        loadTime,
        namelocalFile: pathFile.values.nameFile,
      });

      await this._catalogProvider.deleteTermsConditions();

      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
        EDescriptionTracingGeneral.DATA_COLPRTTERMS, ETaskTracingGeneral.DELETE_DATA);

      const content = await this._fileManagerProvider.getDataCsvHeader(localPath, ';');

      if (content.length == 0) {
        this.logger.write('getSftptyc() - No se encontro data en el archivo', Etask.ERROR_DATA, ELevelsErros.WARNING)
        return
      }

      await this._catalogProvider.saveTermsConditions(content)

      await this._sftpManagerProvider.writeFile(putPath, localPath)
      await this._fileManagerProvider.deleteFile(localPath);
    } catch (error) {
      await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS, ETaskTracingGeneral.FILE_TRANSFORM);
      this.logger.write('getSftpSku() ' + error.tasks, Etask.ERROR_DATA, ELevelsErros.ERROR);
      utils.assignTaskError(error, Etask.TRANSFORMDATA, ETaskDesc.TRANSFORMDATA);
      await this._GetErrorTracing.getError(error);
    }
  }


  /**
   * Funcion para la transformacion y guardado de las caracteristicas 
   * @param {*} localPath le envia el directorio con el archivo que va a ser leido desde un servidor sftp
   * @returns {boolean} si se completo o no el proceso
   */
  async transformFile2(filePath: string) {

    this.logger.write(
      'Inicia Read File',
      Etask.START_READ_FILE,
      ELevelsErros.INFO,
      '',
    );

    const fileStream = fs.createReadStream(filePath);
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });

    let lines = [];
    let lineCount = 0;

    for await (const line of rl) {
      try {
        // Formatear la línea
        const formattedLine = this.formatLine(line);
        lines.push(formattedLine);
        lineCount++;

        // Guardar en la BD cada 100 líneas
        if (lineCount % 100 === 0) {
          await this.saveLinesWithRetry(lines);
          lines = []; // Limpiar el array para liberar memoria
        }
      } catch (error) {
        this.logger.write(`Error procesando la línea: ${error}`, Etask.READ_JSON, ELevelsErros.ERROR)
      }
    }
    this.logger.write(
      'Finished reading file',
      Etask.FINISHED_READ_FILE,
      ELevelsErros.INFO,
      '',
    );

    // Guardar las líneas restantes
    if (lines.length > 0) {
      await this.saveLinesWithRetry(lines);
    }
    this.logger.write(
      'Save data COLPRTTTATTRIBUTES',
      Etask.SAVE_DATA_COLPRTTTATTRIBUTES,
      ELevelsErros.INFO,
      ''
    );
  }

  async saveLinesWithRetry(lines, retries = 3) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        await this._catalogProvider.saveAttributes(lines);
        return;
      } catch (error) {
        if (attempt === retries) {
          this.logger.write(`Error guardando líneas después de ${retries} intentos: ${error}`, Etask.READ_JSON, ELevelsErros.ERROR)
          throw error;
        }
        this.logger.write(`Reintentando guardar líneas (intento ${attempt}): ${error}`, Etask.READ_JSON, ELevelsErros.WARNING)
      }
    }
  }

  formatLine(line: string) {
    const dataOrignal = line.substring(1, line.length - 1);
    const dataClean = dataOrignal.replace(/[/\\]/g, '');
    return JSON.parse(dataClean)
  }


  async saveFileCharacteristics(dateTimeNow, localPath: string, putPath: string) {
    await this._GetErrorTracing.createTraceability(EStatusTracingGeneral.STATUS_SUCCESS,
      EDescriptionTracingGeneral.WRITE_FILE_CARAC, ETaskTracingGeneral.SAVE_DATA);

    const dateFile = this.formatDate(dateTimeNow);

    await this._sftpManagerProvider.writeFile(putPath, localPath,dateFile);

    await this._fileManagerProvider.deleteFile(localPath);
  }

  formatDate(dateTimeNow) {
    const year = dateTimeNow.getFullYear();
    const month = String(dateTimeNow.getMonth() + 1).padStart(2, '0'); // El mes es 0-indexado, por eso se suma 1
    const day = String(dateTimeNow.getDate()).padStart(2, '0');

    // Obtener los componentes de la hora
    const hours = String(dateTimeNow.getHours()).padStart(2, '0');
    const minutes = String(dateTimeNow.getMinutes()).padStart(2, '0');
    const seconds = String(dateTimeNow.getSeconds()).padStart(2, '0');

    // Formatear la fecha en el formato YYYYMMDD_HHMMSS
    return `${year}${month}${day}_${hours}${minutes}${seconds}`;

  }

}