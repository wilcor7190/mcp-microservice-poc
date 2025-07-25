/**
 * Clase para la construcción del orquestador para todos los flujos
 * @author Oscar Robayo
 */
import { Injectable } from "@nestjs/common";
import { ResponseService } from "../../controller/dto/response-service.dto";


@Injectable()
export abstract class IOrchPricesUc {

    /**
     * Orquestador que controla el orden de los flujos
     */
    abstract orchPricesUc(): Promise<ResponseService>;
}