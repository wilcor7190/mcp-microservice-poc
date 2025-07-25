/**
 * Clase con metodos utilizados para crear archivos csv
 * @author Santiago Vargas
 */

import fs = require('fs');
import find from '../../common/utils/UtilConfig';
import Logging from "../lib/logging";
import { ETaskDesc, Etask } from './enums/taks.enum';
const csvwriter = require('csv-writer');

export default class CreateCsv {

  static logger = new Logging(CreateCsv.name);
  
  /**
   * Crea archivo csv en servidor local
   * @param {Object} data Información que se escribira en el archivo
   * @param {String} csvRootFile Nombre del archivo sftp
   * @param {Object} header Titulos para las columnas del archivo
   * @param {String} titleFile Primera línea a escribir del archivo
   * @param {String} nameFile Nombre del archivo local
   */
  public static async createCsv(data: any, csvRootFile: string, header: any, titleFile: string, nameFile: string): Promise<void> {
    try {
      await new Promise<void>((resolve, reject) => {
        fs.writeFile(csvRootFile, `${titleFile}\n`, (err) => {
          if (err) reject(err);
          resolve();
        });
      });

      let createCsvWriter = csvwriter.createObjectCsvWriter;
      const CSV_ROOT = await find.getCsv(nameFile);
      const CSV_WRITER = await createCsvWriter({
        path: CSV_ROOT,
        header,
      });
      
      await CSV_WRITER.writeRecords(data);
      this.logger.write('createCsv()', Etask.GENERATE_CSV);
    } catch (error) {
      this.logger.write(`createCsv() | ${ETaskDesc.ERROR_CREATE_FILE} - ${nameFile} | ${error.stack}`, Etask.GENERATE_CSV);
    }
  }
  
  /**
   * Unifica archivo local con archivo sftp
   * @param {String} nameFile Nombre del archivo local
   * @param {String} csvRootFile Nombre del archivo sftp
   */
  public static async unificateFiles(nameFile: string, csvRootFile: string): Promise<void> {
    const CSV_ROOT = find.getCsv(nameFile);
    const W = fs.createWriteStream(csvRootFile, { flags: 'a' }); // Abre el archivo en modo de anexado
    const R = fs.createReadStream(CSV_ROOT, 'utf8'); // Lee el archivo local en formato UTF-8

    return new Promise<void>((resolve, reject) => {
      R.pipe(W)
        .on('finish', resolve)
        .on('error', reject);
    });
  }
}

