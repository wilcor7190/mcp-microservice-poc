import { Injectable } from "@nestjs/common";
import { IParam } from '@claro/generic-models-library';
/**
 * Clase abstracta con la funcionalidad de actualizar las caracteristicas
 * @author Santiago Vargas
 */
@Injectable()
export abstract class ICategoriesUC {

    /**
     * Función para actualizar las caracteristicas
     */
    abstract updateFeatures(categories: IParam);
}