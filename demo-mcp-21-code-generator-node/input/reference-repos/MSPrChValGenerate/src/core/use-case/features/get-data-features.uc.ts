/**
 * Clase para manejar las caracteristicas del ftp
 * @author Juan Gabriel Garzon
 */

import { Injectable } from "@nestjs/common";

@Injectable()
export abstract class IGetDataFeaturesUc {
    /**
     * 1 Descargar el archivo
     * 2 Recorrido de files 
     * 3 Almacenar
     */
    abstract getSftpFiles(): Promise<any>

}