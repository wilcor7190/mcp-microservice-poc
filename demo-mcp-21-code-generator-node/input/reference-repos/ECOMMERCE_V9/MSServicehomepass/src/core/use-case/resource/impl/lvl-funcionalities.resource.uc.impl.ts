/**
 * Clase creada para ordenar los mapeos recurrentes utilizados en el ms
 * @author Juan Romero
 */
import { Injectable } from '@nestjs/common';
import { ILvlFuncionalitiesUc } from '../lvl-funcionalities.resource.uc';
import { IConglomerateElementsDTO } from '../../../../controller/dto/conglomerateResponseElements/conglomerateElements.dto';
import { EaddressElement } from '../../../../common/utils/enums/addressElement.enum';
import Logging from 'src/common/lib/logging';
import GeneralUtil from 'src/common/utils/generalUtil';
import { ETaskDesc, Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import { IPoComplemento } from 'src/core/entity/address-complement/po-complementos.entity';
import { IComplement } from 'src/core/entity/address-complement/geographic-address-list.entity';
import * as jp from 'jsonpath';
import { ILevelMap } from 'src/core/entity/address-complement/level-map.entity';
@Injectable()
export class LvlFuncionalitiesUcimpl implements ILvlFuncionalitiesUc {
  private readonly logger = new Logging(LvlFuncionalitiesUcimpl.name);

  /**
   * Metodo para validar si el objeto está vacío
   * @param {any} data informacion a mapear
   * @returns {boolean} resultado de la validacion
   */
  validateData(data: any): boolean {
    return (
      data?.nivel1Type === undefined &&
      data?.nivel2Type === undefined &&
      data?.nivel3Type === undefined &&
      data?.nivel4Type === undefined &&
      data?.nivel5Type === undefined &&
      data?.nivel6Type === undefined
    );
  }

  /**
   * Metodo con logica para mapear la estructura de alternate geographic y complements
   * @param {any} data informacion a mapear
   * @param {boolean} flag bandera de indicacion para mapeo
   * @returns {array} arreglo construido
   */
  mapFilling(data: any, flag: boolean) {
    let arrayFill = [undefined, undefined, undefined, undefined, undefined, undefined];
    let lvl;

    if (flag) {
      lvl = 6;
    } else {
      let arrayKeys = Object.keys(data);
      let p1 = arrayKeys[arrayKeys.length - 1].split('Value');
      p1 = String(p1[0]).split('nivel');
      lvl = Number(p1[1]);
    }

    for (let i = 0; i < lvl; i++) {
      arrayFill[i] = 'OTRO';
    }

    return arrayFill;
  }

  /**
   * Metodo para segmentar la informacion por tipos
   * @param {any} infoToMap informacion a mapear
   * @param {string} component nombre del metodo que consume
   * @return {array} es una promesa
   */
  segmentationByType(infoToMap: any, component: string) {
    this.logger.write('segmentationByType()', Etask.SEGMENTATION_BY_TYPE, ELevelsErrors.INFO, { infoToMap, component });
    try {
      let initNumber = 0;
      let endNumber = 0;
      let array_columns = [];
      let valuesConglomerateElements = Object.values(EaddressElement).filter((value) => typeof value === 'string');

      switch (component) {
        case 'AlternateGeographicAddress':
          endNumber = 11;
          break;
        case 'Complement':
          initNumber = 12;
          endNumber = infoToMap[0].length;
          endNumber = endNumber > 24 ? 24 : endNumber;
          break;
      }

      infoToMap.forEach((element) => {
        for (let x = initNumber; x < endNumber; x = x + 2) {
          if (element[x] != 'OTRO') array_columns.push(Number(x));
        }
      });

      array_columns = Array.from(new Set(array_columns));

      if (array_columns.length === 0) return {};
      let array_segmentation = this.arraySegmentation(infoToMap, array_columns, valuesConglomerateElements);

      array_segmentation.forEach((element) => {
        element.value = Array.from(new Set(element.value));
      });
      let cant = this.calculateCant(array_segmentation);
      return this.conglomerateArray(array_segmentation, cant);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.SEGMENTATION_BY_TYPE, ETaskDesc.SEGMENTATION_BY_TYPE);
      throw error;
    }
  }

  /**
   * Metodo para calcular cuantos tipos de residencia se encuentran segmentados
   * @param {any} array_segmentation informacion a validar
   * @returns {any} cantidad velidada
   */
  calculateCant(array_segmentation: any) {
    let cant = 0;
    if (array_segmentation.length > 1) {
      for (let a = 0; a < array_segmentation.length - 1; a++) {
        if (array_segmentation[a].lvlnumber == array_segmentation[a + 1].lvlnumber) {
          cant++;
        }
      }
    }
    return cant;
  }

  /**
   * Metodo para segmentar la informacion de residencias ingresadas
   * @param {any} addressComplment
   * @param {any} array_columns columnas que contienen informacion
   * @param {any} valuesConglomerateElements enum transformado que contiene los tipos por medio de los cuales se segmentala informacion
   * @returns {any} informacion segmentada
   */
  arraySegmentation(addressComplment: any, array_columns: any, valuesConglomerateElements: any) {
    let array_segmentation = [];
    addressComplment.forEach((element) => {
      let flag = 0;
      let flagValue = undefined;
      let sep1 = undefined;
      let sep2 = undefined;

      for (let i = 0; i < array_columns.length; i++) {
        let info = new IConglomerateElementsDTO();
        let numbers_list = [];

        if (!array_segmentation.length) {
          info.nameT = valuesConglomerateElements[array_columns[i]];
          sep1 = info.nameT.split('Type');
          sep2 = String(sep1[0]).split('nivel');
          info.lvlnumber = Number(sep2[1]);
          info.type = element[array_columns[i]];
          info.nameV = valuesConglomerateElements[array_columns[i] + 1];
          flagValue = element[array_columns[i] + 1];
          if (flagValue != undefined) {
            numbers_list.push(element[array_columns[i] + 1] ? element[array_columns[i] + 1] : '');
            info.value = numbers_list;
          }
          array_segmentation.push(info);
        } else {
          let valuesElse = {
            element: element,
            array_columns: array_columns,
            i: i,
            array_segmentation: array_segmentation,
            flag: flag,
            info: info,
            sep1: sep1,
            sep2: sep2,
            valuesConglomerateElements: valuesConglomerateElements,
            flagValue: flagValue,
            numbers_list: numbers_list,
          };

          array_segmentation = this.elseArraySegmentation(valuesElse);
        }
      }
    });

    return array_segmentation;
  }

  /**
   * Metodo alternativo al flujo se ArraySegmentation
   * @param {any} valuesElse valores para mapear
   * @returns {array} array segmentado
   */
  elseArraySegmentation(valuesElse: any) {
    let element = valuesElse.element;
    let array_columns = valuesElse.array_columns;
    const i = valuesElse.i;
    let array_segmentation = valuesElse.array_segmentation;
    let flag = valuesElse.flag;
    let info = valuesElse.info;
    let sep1 = valuesElse.sep1;
    let sep2 = valuesElse.sep2;
    let valuesConglomerateElements = valuesElse.valuesConglomerateElements;
    let flagValue = valuesElse.flagValue;
    let numbers_list = valuesElse.numbers_list;

    let type = element[array_columns[i]];
    let value = element[array_columns[i] + 1];
    array_segmentation.forEach((element1) => {
      if (element1.type == type) {
        element1.value.push(value);
        flag = 1;
      }
    });
    if (flag == 0) {
      if (element[array_columns[i]] === 'OTRO') return array_segmentation;
      info.nameT = valuesConglomerateElements[array_columns[i]];
      sep1 = info.nameT.split('Type');
      sep2 = String(sep1[0]).split('nivel');
      info.lvlnumber = Number(sep2[1]);
      info.type = element[array_columns[i]];
      if (info.type != undefined) {
        info.nameV = valuesConglomerateElements[array_columns[i] + 1];
        flagValue = element[array_columns[i] + 1];
        if (flagValue != undefined) {
          numbers_list.push(element[array_columns[i] + 1]);
          info.value = numbers_list;
        }
        array_segmentation.push(info);
      }
    }

    return array_segmentation;
  }

  /**
   * Metodo utilizado para conglomerar el array
   * @param array_segmentation tipos de residencia segmentados
   * @param cant cantidad de tipos ingresados
   * @returns {array} tipos conglomerados ena arreglo
   */
  conglomerateArray(array_segmentation, cant) {
    if (array_segmentation != undefined && array_segmentation.length != 0) {
      let map1 = new Map();
      let conglomerateArray = [];
      let obj = undefined;
      const mapDenominator = new Map();

      if (cant == 0) {
        array_segmentation.forEach((element) => {
          map1.set(element.nameT, element.type);
          map1.set(element.nameV, String(element.value));
        });

        obj = Object.fromEntries(map1);

        conglomerateArray.push(obj);

        return conglomerateArray;
      } else if (cant == array_segmentation.length - 1) {
        array_segmentation.forEach((element) => {
          map1.set(element.nameT, element.type);
          map1.set(element.nameV, String(element.value));
          obj = Object.fromEntries(map1);

          conglomerateArray.push(obj);
        });

        return conglomerateArray;
      } else {
        for (let u = 0; u < array_segmentation.length - cant - 1; u++) {
          mapDenominator.set(array_segmentation[u].nameT, array_segmentation[u].type);
          mapDenominator.set(array_segmentation[u].nameV, String(array_segmentation[u].value));
        }

        for (let o = mapDenominator.size / 2; o < array_segmentation.length; o++) {
          map1 = mapDenominator;

          map1.set(array_segmentation[o].nameT, array_segmentation[o].type);
          map1.set(array_segmentation[o].nameV, String(array_segmentation[o].value));
          obj = Object.fromEntries(map1);

          conglomerateArray.push(obj);
        }

        return conglomerateArray;
      }
    }
  }

  mapAlternateGeographicAddress(poComplements: IPoComplemento[]): IComplement | {} {
    let response: IComplement = {};
    let poComplement: IPoComplemento;
    if (poComplements.length != 1) return {};
    if (poComplements.length === 1) poComplement = poComplements[0];
    if (!poComplement) return response;
    if (poComplement.PO_MZ_TIPO_NIVEL1 != 'OTRO') response.nivel1Type = poComplement.PO_MZ_TIPO_NIVEL1;
    if (poComplement.PO_MZ_VALOR_NIVEL1 != 'OTRO') response.nivel1Value = poComplement.PO_MZ_VALOR_NIVEL1;
    if (poComplement.PO_MZ_TIPO_NIVEL2 != 'OTRO') response.nivel2Type = poComplement.PO_MZ_TIPO_NIVEL2;
    if (poComplement.PO_MZ_VALOR_NIVEL2 != 'OTRO') response.nivel2Value = poComplement.PO_MZ_VALOR_NIVEL2;
    if (poComplement.PO_MZ_TIPO_NIVEL3 != 'OTRO') response.nivel3Type = poComplement.PO_MZ_TIPO_NIVEL3;
    if (poComplement.PO_MZ_VALOR_NIVEL3 != 'OTRO') response.nivel3Value = poComplement.PO_MZ_VALOR_NIVEL3;
    if (poComplement.PO_MZ_TIPO_NIVEL4 != 'OTRO') response.nivel4Type = poComplement.PO_MZ_TIPO_NIVEL4;
    if (poComplement.PO_MZ_VALOR_NIVEL4 != 'OTRO') response.nivel4Value = poComplement.PO_MZ_VALOR_NIVEL4;
    if (poComplement.PO_MZ_TIPO_NIVEL5 != 'OTRO') response.nivel5Type = poComplement.PO_MZ_TIPO_NIVEL5;
    if (poComplement.PO_MZ_VALOR_NIVEL5 != 'OTRO') response.nivel5Value = poComplement.PO_MZ_VALOR_NIVEL5;
    if (poComplement.PO_MZ_TIPO_NIVEL6 != 'OTRO') response.nivel6Type = poComplement.PO_MZ_TIPO_NIVEL6;
    if (poComplement.PO_MZ_VALOR_NIVEL6 != 'OTRO') response.nivel6Value = poComplement.PO_MZ_VALOR_NIVEL6;
    return response;
  }

  mapComplements(poComplements: IPoComplemento[]): IComplement[] {
    let response: IComplement[] = [];
    let levelsToMap: ILevelMap[] = [];
    let level = 1;
    while (level <= 6) {
      levelsToMap.push({
        values: Array.from(
          new Set(
            poComplements
              .filter((complement) => complement[`PO_CP_NIVEL_NIVEL${level}`] && complement[`PO_CP_NIVEL_NIVEL${level}`] != 'OTRO')
              .map((value) => value[`PO_CP_NIVEL_NIVEL${level}`]),
          ),
        ),
        level,
      });
      level++;
    }
    levelsToMap = levelsToMap.filter((levelMap) => levelMap.values.length > 0);
    return this.mapComplemetByLevel(poComplements, levelsToMap);
  }

  mapComplemetByLevel(poComplements: IPoComplemento[], levelsToMap: ILevelMap[]): IComplement[] {
    let response: IComplement[] = [];
    let maxLevel: number = levelsToMap.length;
    switch (maxLevel) {
      case 1:
        levelsToMap[0].values.forEach((key) => {
          response.push({
            [`nivel${levelsToMap[0].level}Type`]: key,
            [`nivel${levelsToMap[0].level}Value`]: jp
              .query(poComplements, `$..[?(@.PO_CP_NIVEL_NIVEL${levelsToMap[0].level} == "${key}")]`)
              .map((value) => value[`PO_CP_VALOR_NIVEL${levelsToMap[0].level}`])
              .join(','),
          });
        });
        break;
      case 2:
        levelsToMap[1].values.forEach((key) => {
          response.push({
            [`nivel${levelsToMap[0].level}Type`]: levelsToMap[0].values[0],
            [`nivel${levelsToMap[0].level}Value`]: Array.from(
              new Set(
                jp
                  .query(
                    poComplements,
                    `$..[?(@.PO_CP_NIVEL_NIVEL${levelsToMap[0].level} == "${levelsToMap[0].values[0]}" && @.PO_CP_NIVEL_NIVEL${levelsToMap[1].level} == "${key}")]`,
                  )
                  .map((value) => value[`PO_CP_VALOR_NIVEL${levelsToMap[0].level}`]),
              ),
            ).join(','),
            [`nivel${levelsToMap[1].level}Type`]: key,
            [`nivel${levelsToMap[1].level}Value`]: jp
              .query(
                poComplements,
                `$..[?(@.PO_CP_NIVEL_NIVEL${levelsToMap[0].level} == "${levelsToMap[0].values[0]}" && @.PO_CP_NIVEL_NIVEL${levelsToMap[1].level} == "${key}")]`,
              )
              .map((value) => value[`PO_CP_VALOR_NIVEL${levelsToMap[1].level}`])
              .join(','),
          });
        });
        break;
      default:
        break;
    }
    return response;
  }
}
