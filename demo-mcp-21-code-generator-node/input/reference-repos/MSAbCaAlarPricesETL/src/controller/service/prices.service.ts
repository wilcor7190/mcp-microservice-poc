/**
 * Clase abstracta para realizar las respectivas operaciones para la etl de precios
 * @author Oscar Robayo
 */
import { Injectable } from "@nestjs/common";
import { ResponseService } from "../dto/response-service.dto";


@Injectable()
export abstract class IPricesService {

    /**
     * Realiza el proceso necesario para la creacion de data
     */
    abstract pricesProcess(): Promise<ResponseService>;
}