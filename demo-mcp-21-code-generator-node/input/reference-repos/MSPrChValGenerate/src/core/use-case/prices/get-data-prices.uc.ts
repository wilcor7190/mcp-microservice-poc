/**
 * clase del ftp para prices
 * @author Juan Gabriel Garzon
 */

import { Injectable } from "@nestjs/common";



@Injectable()
export abstract class IGetDataPricesUc {
    /**
     * 1 Descargar los archivos
     * 2 Recorrido de files 
     * 3 Almacenar
     */
    abstract getSftpFiles(): Promise<any>

}