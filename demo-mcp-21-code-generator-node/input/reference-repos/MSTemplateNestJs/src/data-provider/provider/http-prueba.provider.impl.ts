/**
 * Clase generica para realizar consumos Rest
 * @author Oscar Alvarez
 */
import { Injectable } from "@nestjs/common";
import servicesConfig from "src/common/configuration/services.config";
import { Etask } from "src/common/utils/enums/taks.enum";
import { IHttpPruebaProvider } from "../http-prueba.provider";
import { IHttpProvider } from "../http.provider";
import { EHttpMethod } from "../model/http/request-config-http.model";
import { ResponseHttp } from "../model/http/response-http.model";

@Injectable()
export class HttpPruebaProvider implements IHttpPruebaProvider {

    constructor(
        private httpProvider: IHttpProvider
    ) { }


    /**
    * Operación para consultar por identificador
    * @param {String} _id identificador 
    * @returns informacion asociada
    */
    async getById(_id: string): Promise<ResponseHttp<any>> {
        const url = `${servicesConfig.testService}/${_id}`;
        const headers = {
            "Connection": "Keep-Alive",
            "Content-Type": "application/json; charset=utf-8",
            "Date": Date.now().toString,
            "Cache-Control": "no-cache"
        };
        const params = {
            "id": _id
        };

        return this.httpProvider.executeRest({ method: EHttpMethod.get, url, params, headers}, Etask.FINDONE);
    }

    /**
    * Operación para consultar segun la configuracion
    * @param {Number} page Número de página a consultar
    * @param {Number} limit Cantidad de registros por página
    * @returns informacion asociada a la busquedad
    */
    async getAll(page: number, limit: number): Promise<ResponseHttp> {
        const url = servicesConfig.testService;
        const headers = {
            "Connection": "Keep-Alive",
            "Content-Type": "application/json; charset=utf-8",
            "Date": Date.now().toString,
        };
        const params = {
            page,
            limit
        };

        return this.httpProvider.executeRest({ method: EHttpMethod.get, url, params, headers}, Etask.FINDALL);
    }

}