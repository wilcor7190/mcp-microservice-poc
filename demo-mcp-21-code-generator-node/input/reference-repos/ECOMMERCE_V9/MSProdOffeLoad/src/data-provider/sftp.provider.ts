/**
 * Clase abstracta con la definición de operaciones a realizar para conectarse con el servidor sftp
 * @author Santiago Vargas
 */

import { Injectable } from "@nestjs/common";
import { IImagesAttachments } from "../core/entity/catalog/images-attachments.entity";

@Injectable()
export abstract class ISftpProvider {

  /**
   * Operación para actualizar un archivo en el servidor sftp
   * @param {String} localPath Ruta con el archivo local
   * @param {String} remotePath Ruta del archivo sftp
   */  
  abstract update(remotePath: string, localPath: string): Promise<any>;

  /**
   * Operación para obtener las imagenes del servidor sftp
   * @param {String} path Ruta donde estan almacenadas las imagenes
   * @returns {IImagesAttachments[]} Arreglo con las imagenes obtenidas
   */  
  abstract readFileImg(path: string): Promise<IImagesAttachments[]>;
}