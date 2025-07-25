/**
 * Clase con la definición de operaciones a realizar en las colecciones de catalogo
 * @author Daniel C Rubiano E
 */

import { Injectable } from '@nestjs/common';
import { IDataloadProvider } from '../../../data-provider/dataload.provider';
import { ICatalog } from 'src/core/entity/catalog/catalog.entity';
import Logging from '../../../common/lib/logging';
import { Etask, ETaskDesc } from '../../../common/utils/enums/taks.enum';
import { IDataloadUC } from '../dataload.uc';

@Injectable()
export class DataloadUCImpl implements IDataloadUC {
  constructor(
    private _dataloadProvider: IDataloadProvider,
  ) {}

  private readonly logger = new Logging(DataloadUCImpl.name);

  /**
   * Operación para consultar los productos de terminales (Features)
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */
  async findEquipmentDataload(): Promise<ICatalog[]> {
    try {
      return await this._dataloadProvider.findEquipment();
    } catch (error) {
      this.logger.write(
        `findEquipment() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para consultar los productos de terminales (Features) filtrados por clasificación
   * @returns {ICatalog[]} Arreglo con los productos de terminales
   */
  async findEquipmentFilterDataload(): Promise<ICatalog[]> {
    try {
      return await this._dataloadProvider.findEquipmentFilter();
    } catch (error) {
      this.logger.write(
        `findEquipmentFilter() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para consultar los productos de tecnología (Features)
   * @returns {ICatalog[]} Arreglo con los productos de tecnología
   */
  async findTechnologyDataload(): Promise<ICatalog[]> {
    try {
      return await this._dataloadProvider.findTechnology();
    } catch (error) {
      this.logger.write(
        `findTechnology() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para consultar los productos de tecnología (Features)
   * @returns {ICatalog[]} Arreglo con los productos de tecnología
   */
  async findPospagoDataload(): Promise<ICatalog[]> {
    try {
      return await this._dataloadProvider.findPospago();
    } catch (error) {
      this.logger.write(
        `findPospago() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para consultar los productos de prepago (Features)
   * @returns {ICatalog[]} Arreglo con los productos de prepago
   */
  async findPrepagoDataload(): Promise<ICatalog[]> {
    try {
      return await this._dataloadProvider.findPrepago();
    } catch (error) {
      this.logger.write(
        `findPrepago() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para consultar los productos de hogares (Features)
   * @returns {ICatalog[]} Arreglo con los productos de hogares
   */
  async findHomesDataload(): Promise<ICatalog[]> {
    try {
      return await this._dataloadProvider.findHomes();
    } catch (error) {
      this.logger.write(
        `findHomes() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para consultar padres e hijos
   * @returns {Object} Arreglo con la lista de padres e hijos
   */
  async getListParentsDataload(): Promise<any> {
    try {
      return await this._dataloadProvider.getListParents();
    } catch (error) {
      this.logger.write(
        `getListParents() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para guardar los padres e hijos
   * @param {Object} data Arreglo con la lista de padres e hijos
   * @returns {Boolean} Confirmación de creación de registros
   */
  async saveListParentsDataload(data: any): Promise<any> {
    try {
      return await this._dataloadProvider.saveListParents(data);
    } catch (error) {
      this.logger.write(
        `saveListParents() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }

  /**
   * Operación para consultar y mapear los productos generados por el product-data (Padres-Hijos)
   * @param {ICatalog[]} data Productos por categoría
   * @param {String} family Categoría solicitada
   * @returns {ICatalog[]} Padres e hijos mapeados
   */
  public async orderListParentDataload(data: ICatalog[], family: string): Promise<ICatalog[]> {
    try {
      return await this._dataloadProvider.orderListParent(data, family);
    } catch (error) {
      this.logger.write(
        `orderListParent() | ${ETaskDesc.ERROR_FIND_DATA}`,
        Etask.FIND_DATA,
      );
    }
  }
}
