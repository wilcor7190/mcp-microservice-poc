import { Injectable } from '@nestjs/common';
import { IMappingFeature } from '../core/entity/categories/category.entity';
import { IFilterCategorie } from '../core/entity/categories/filter-category.entity';
import { ICatalog } from '../core/entity/catalog.entity';

/**
 * Clase abstracta con la definición de operaciones que realizara el ms
 * @author Santiago Vargas
 */
@Injectable()
export abstract class ICategoriesProvider {
    /**
     * Operación para consultar las caracteristicas desde COLPRTPRODUCTOFFERING
     * @param {Object} filter Parametros para el filtro en la colección
     */
    abstract getContingency(filter: IFilterCategorie): Promise<any>;

    /**
     * Operación para actualizar las caracteristicas
     * @param {Object} data Caracteristicas para actualizar
     * @param {String} family Filtro para la colección donde se guardara la información
     */
    abstract updateFeatures(data: IMappingFeature[], family: string): Promise<any>;

    /**
     * Operación para eliminar las colecciones
     * @param {String} family Filtro para la colección donde se eliminara la información
     */
    abstract deleteCollections(family: string): Promise<any>;

    /**
     * Operación para consultar las colecciones
     * @param {String} family Filtro para la colección donde se consulta la información
     * @returns {ICatalog[]} Arreglo con los productos de la coleccion
     */
    abstract findCollections(family: string): Promise<ICatalog[]>;

    /**
     * Operación para actualizar las características regulatorias
     * @param {String} family Categoría para el flujo del que se consultan las caracteristicas
     */    
    abstract updateRegulatoryFeatures(family: string): Promise<void>
}