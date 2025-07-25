/**
 * clase abstracta donde se definen operaciones para caracteristicas y precios del flujo movil
 * * @author Uriel Esguerra
 */
import { Injectable } from "@nestjs/common";
import { Etask } from "src/common/utils/enums/taks.enum";
import { IMovilFeaturesDTO } from "src/controller/dto/general/movil/movideFeatures.dto";
import { IMovilPricesDTO } from "src/controller/dto/general/movil/movidePrices.dto";

@Injectable()
export abstract class IMovilFeaturesProvider {
    abstract saveTransformDataMovilFeature(content: IMovilFeaturesDTO)
    abstract saveTransformDataMovilPrices(content: IMovilPricesDTO)
    abstract deleteDataMovilFeature()
    abstract deleteDataMovilPrices()
    abstract createLog(request: any, startTime: any, task: Etask)
}