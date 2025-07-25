/**
 * Clase con la definición de operaciones a realizar para conectarse con el servidor sftp
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../common/configuration/general.config';
import Logging from '../../common/lib/logging';
import { Etask } from '../../common/utils/enums/taks.enum';
import { IImagesAttachments } from '../../core/entity/catalog/images-attachments.entity';
import { ISftpProvider } from '../sftp.provider';
import Client = require('ssh2-sftp-client');
import { ELevelsErros } from '../../common/utils/enums/logging.enum';

@Injectable()
export class SftpProvider implements ISftpProvider {

  private readonly logger = new Logging(SftpProvider.name);

  /**
   * Operación para actualizar un archivo en el servidor sftp
   * @param {String} localPath Ruta con el archivo local
   * @param {String} remotePath Ruta del archivo sftp
   */
  async update(localPath: string, remotePath: string): Promise<any> {
    const START_TIME = process.hrtime();
    let connection = new Client();    
    await connection.connect({
      host: generalConfig.sftpModuleHost,
      port: Number(generalConfig.sftpModulePort),
      username: generalConfig.sftpModuleUsername,
      password: generalConfig.sftpModulePassword
    }).then(async () => {
      return connection.fastPut(localPath, remotePath);
    }).finally(() => {
      this.logger.write('', START_TIME, ELevelsErros.INFO, false);
      connection.end();
    }).catch((err) => {
      this.logger.write('', START_TIME, ELevelsErros.ERROR, true, `update() | ${err.stack}: ${JSON.stringify(err.stack)}`);
    });
  }

  /**
   * Operación para obtener las imagenes del servidor sftp
   * @param {String} path Ruta donde estan almacenadas las imagenes
   * @returns {IImagesAttachments[]} Arreglo con las imagenes obtenidas
   */
  async readFileImg(path: string): Promise<IImagesAttachments[]> {
    const START_TIME = process.hrtime();
    let images = [];
    let connection = new Client();
    await connection.connect({
      host: generalConfig.sftpReadFileImgHost,
      port: Number(generalConfig.sftpModulePortReadImage),
      username: generalConfig.sftpReadFileImgUsername,
      password: generalConfig.sftpReadFileImgPassword
    }).then(async () => {
      this.logger.write('readFileImg()', Etask.GET_IMAGES);
      images = await connection.list(path);
    }).then(() => {
      connection.end();
      this.logger.write('', START_TIME, ELevelsErros.INFO, false);
    }).catch(err => {
      this.logger.write('', START_TIME, ELevelsErros.ERROR, true, `readFileImg() | ${err.stack}`);
    });
    return images;
  }

}