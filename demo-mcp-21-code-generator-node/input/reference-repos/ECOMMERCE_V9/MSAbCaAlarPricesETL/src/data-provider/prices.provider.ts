/**
 * Clase con operaciones de consumos a lastPrices
 * @author Alexis Sterzer
 */
import { Injectable } from "@nestjs/common";
import { LastPrices } from "../core/entity/prices/product-offering-prices.entity";
import { PricesFamily } from "../common/utils/enums/prices.enum";

@Injectable()
export abstract class IPricesProvider {

    /**
     * Operacion para traer la data de Precios
     * @param filter Filtro para realizar la consulta
     */
    abstract findLastPrices(filter: string, family: PricesFamily): Promise<LastPrices>;

    /**
     * Operacion para actualizar el contenido o la data en la colección
     * @param content Contenido o data para insertar en la colección
     * @param nameCollection Nombre de la coleccion
     */
    abstract saveDataLastPrices(filter: string, content: LastPrices): Promise<LastPrices>;

}