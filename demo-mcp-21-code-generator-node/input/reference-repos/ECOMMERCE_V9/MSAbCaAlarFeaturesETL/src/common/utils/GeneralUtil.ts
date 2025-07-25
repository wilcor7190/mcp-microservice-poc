/**
 * Clase con metodos utilitarios como transformacion de data
 * @author Oscar Alvarez
 */

const rTracer = require('cls-rtracer');
const path = require("path");
const FS = require("fs");
import { IValidationsToCreateTechnologyName, IValueForDifferentFeatureId } from '../../core/entity/catalog.entity';
import { MessageUcimpl } from '../../core/use-case/impl/message.uc.impl';
import { ParamUcimpl } from '../../core/use-case/resource/impl/param.resource.uc.impl';
import generalConfig from '../configuration/general.config';
import Logging from '../lib/logging';
import { ELevelsErros } from './enums/logging.enum';
import { EmessageMapping } from './enums/message.enum';
import { EtypeDocument } from './enums/params.enum';
import { ETaskDesc, Etask } from './enums/taks.enum';
const xml2js = require('xml2js');
export default class GeneralUtil {

  public static get getCorrelationalId(): string {
    return rTracer.id() || '';
  }

  /**
   * Convierte data con estructura xml a objeto en formato JSON
   * @param {any} xml string con estructura xml a transformar
   * @returns JSON resultado de la transformación
   */
  public static async convertXmlToJson(xml: any): Promise<any> {
    if (GeneralUtil.validateValueRequired(xml)) {

      // return await xmlParser.xmlToJson(v, (err, json) => {
      const parser = new xml2js.Parser(
        {
          explicitArray: false,
          xmlns: false,
          attrValueProcessors: [function cleanOutput(value, name) {
            return (name.startsWith('xmlns:')) ? undefined : value;
          }],
        });

      return parser.parseStringPromise(xml).then((result) => {
        return JSON.parse(JSON.stringify(result));
      })
        .catch(function (err) {
          new Logging(GeneralUtil.name).write('Error transformando xml a json.' + JSON.stringify(err), Etask.VALIDATE_REQUEST);
          throw new Error(`Error transformando xml a JSON. ${err}`);
        });
    }
    else
      return null;
  }

  /**
     * Función para generar estado de error según respuesta de legado
     * @param {any} result arreglo con información respuesta de legado
     * @returns Cadena con estado de error según respuesta
     */
  public static getLevelError(result: any) {
    let levelError: ELevelsErros;
    if (!result.executed) {
        levelError = ELevelsErros.ERROR;
    } else {
        levelError = (result.status === 200 || result.status === 201) ? ELevelsErros.INFO : ELevelsErros.WARNING
    }
    return levelError
}

  /**
   * Limpia los valores y/o propiedades de un JSON
   * @param json objeto JSON a limpiar
   * @param replaceValues Arregalo de valores a remplazar del json
   * @param replaceBy caracter por el cual se reemplazaran los valores indicados.
   * @returns Objeto json con valores reemplazados
   */
  public static cleanProperties(json: any, replaceValues: string[], replaceBy: string = ''): any {
    let jsonString = JSON.stringify(json);

    replaceValues.forEach(value => {
      jsonString = jsonString.replace(new RegExp(value, 'ig'), replaceBy);
    });

    return JSON.parse(jsonString);
  }

  public static isEmptyObject(obj) {
    return Object.getOwnPropertyNames(obj).length !== 0;
  } 

  /**
   * Valida si el canal recibido en el microservicio es correcto
   * @param {String} channel Canal recibido en el header de una petición api en el microservicio
   * @returns {Boolean} Resultado de validación del canal
   */
  public static validateChannel(channel: string): boolean {
    if (ParamUcimpl.params.find(param => param.id_param == "CHANNEL" && param.values.find((value) => value == channel)))
      return true;
    return false;
  }

  /**
   * Transforma el tipo de documento a su homologo en número
   * @param {EtypeDocument} typeDoc caracter de Tipo de documento en string
   * @returns {Number} Número de homologación del tipo de documento
   */
  public static transformTypeDoc(typeDoc: EtypeDocument): number {
    switch (typeDoc) {
      case EtypeDocument.CC:
        return 1;
      case EtypeDocument.CE:
        return 4;
      default:
        return null; 
    }
  }

  /**
   * Valida el tipo de campo de un registro
   * @param {String} value tipo de campo del valor enviado
   * @returns {String} resultado de homologación si el tipo de campo es correcto
   */
  public static validateValueRequired(value: string | number): boolean {
    if (value == undefined || value == null)
      return false;

    if (typeof value === 'number')
      return value >= 0

    if (typeof value === 'string')
      return !(value === "undefined" || value.trim().length == 0)

    return false;
  }

  /**
   * Retorna url de origen de las solicitudes recibidas por el ms
   * @param {String} url url recibida en el ms 
   * @returns {String} url de origen
   */
  public static getOrigin(url: string): string {
    return `${generalConfig.apiMapping}${(url ?.includes('?')) ? url.slice(0, url.indexOf('?')) : url}`;
  }

  /**
   * Valida la diferencia de días entre dos fechas
   * @param {Date} date1 primera fecha a valida
   * @param {Date} date2 segunda fecha a valida
   * @returns {Number} resultado diferencia de días de las dos fechas
   */  
  public static validateDate(date1: Date, date2: Date): number {
    // With Date object we can compare dates them using the >, <, <= or >=.
    // The ==, !=, ===, and !== operators require to use date.getTime(),
    // so we need to create a new instance of Date with 'new Date()'
    const d1 = new Date(date1); const d2 = new Date(date2);

    // Check if the dates are equal
    const same = d1.getTime() === d2.getTime();
    if (same) return 0;

    // Check if the first is greater than second
    if (d1 > d2) return 1;

    // Check if the first is less than second
    if (d1 < d2) return -1;

    // To calculate the time difference of two dates
    const Difference_In_Time = d2.getTime() - d1.getTime();

    // To calculate the no. of days between two dates
    return Difference_In_Time / (1000 * 3600 * 24);
  }

  /**
   * Consulta el nombre del mensaje por su identificador
   * @param {EmessageMapping} idMessage parametro a buscar en el mensaje
   * @returns valor del nombre del mensaje consultado
   */
  public static mappingMessage(idMessage: EmessageMapping): string {
    return MessageUcimpl.getMessages.find(m => m.id == idMessage) ?.message;
  }

  /**
   * Operación para crear el nombre para el flujo de tecnologia
   * @param {ICatalog} product data
   * @param {String} featureId id para filtar
   * @returns {String} Name
   */
  private static getValueByFeatureId(
    product: any,
    featureId: string,
  ): string {
    return product.versions[0].characteristics.filter((name: any) => name.id == featureId)[0].versions[0]?.value;
    
  }

  /**
   * Operación para crear el nombre a el flujo de tecnologia
   * @param {ICatalog} product data
   * @returns {String} Name
   */
  public static createNameForTechnology(product: any): string {
    try {
      const NOMBRE_COMERCIAL_TECNLG = this.getValueByFeatureId(
        product,
        'NOMBRE_COMERCIAL_TECNLG',
      );
      const PRODUCTO_COMBO_BUNDLE = this.getValueByFeatureId(
        product,
        'PRODUCTO_COMBO_BUNDLE',
      );
      const PRDCTO_COMBO_BUNDLE_DOS_TECNLG = this.getValueByFeatureId(
        product,
        'PRDCTO_COMBO_BUNDLE_DOS_TECNLG',
      );
      const PRDCTO_COMBO_BUNDLE_TRES_TECNL = this.getValueByFeatureId(
        product,
        'PRDCTO_COMBO_BUNDLE_TRES_TECNL',
      );

      const isValidateForNombreComercial =
        !NOMBRE_COMERCIAL_TECNLG || NOMBRE_COMERCIAL_TECNLG === 'NA';
      const isValidateForComboBundle =
        !PRODUCTO_COMBO_BUNDLE || PRODUCTO_COMBO_BUNDLE === 'NA';
      const isValidateForComboBundleDos =
        !PRDCTO_COMBO_BUNDLE_DOS_TECNLG ||
        PRDCTO_COMBO_BUNDLE_DOS_TECNLG === 'NA';
      const isValidateForComboBundleTres =
        !PRDCTO_COMBO_BUNDLE_TRES_TECNL ||
        PRDCTO_COMBO_BUNDLE_TRES_TECNL === 'NA';

      return this.generateNameForTechnology(
        {
          isValidateForNombreComercial,
          isValidateForComboBundle,
          isValidateForComboBundleDos,
          isValidateForComboBundleTres,
        },
        {
          NOMBRE_COMERCIAL_TECNLG,
          PRODUCTO_COMBO_BUNDLE,
          PRDCTO_COMBO_BUNDLE_DOS_TECNLG,
          PRDCTO_COMBO_BUNDLE_TRES_TECNL,
        },
      );
    } catch (error) {
      new Logging(GeneralUtil.name).write(
        `createNameForTechnology() | ${ETaskDesc.ERROR_CREATE_NAME_FOR_TECHNOLOGY}`,
        Etask.CREATE_NAME_FOR_TECHNOLOGY,
      );
    }
  }

  /**
   * Operación para crear el nombre para el flujo de tecnologia
   * @param {IValidationsToCreateTechnologyName} validation data
   * @param {IValueForDifferentFeatureId} featureId id para filtar
   * @returns {String} Name
   */
  private static generateNameForTechnology(
    validation: IValidationsToCreateTechnologyName,
    featureId: IValueForDifferentFeatureId,
  ): string {
    const {
      isValidateForNombreComercial,
      isValidateForComboBundle,
      isValidateForComboBundleDos,
      isValidateForComboBundleTres,
    } = validation;

    const {
      NOMBRE_COMERCIAL_TECNLG,
      PRODUCTO_COMBO_BUNDLE,
      PRDCTO_COMBO_BUNDLE_DOS_TECNLG,
      PRDCTO_COMBO_BUNDLE_TRES_TECNL,
    } = featureId;

    let name = '';

    if (!isValidateForNombreComercial) {
      name = NOMBRE_COMERCIAL_TECNLG;
    }

    if (!isValidateForComboBundle) {
      let comboBundle = PRODUCTO_COMBO_BUNDLE;
      if (!isValidateForNombreComercial) {
        comboBundle = ' con ' + PRODUCTO_COMBO_BUNDLE;
      }
      name = name + comboBundle;
    }

    if (!isValidateForComboBundleDos) {
      let comboBundleDos = PRDCTO_COMBO_BUNDLE_DOS_TECNLG;
      if (!isValidateForComboBundle || !isValidateForNombreComercial) {
        comboBundleDos = ' mas ' + PRDCTO_COMBO_BUNDLE_DOS_TECNLG;
      }
      name = name + comboBundleDos;
    }

    if (!isValidateForComboBundleTres) {
      let comboBundleTres = PRDCTO_COMBO_BUNDLE_TRES_TECNL;
      if (
        !isValidateForComboBundle ||
        !isValidateForNombreComercial ||
        !isValidateForComboBundleDos
      ) {
        comboBundleTres = ' y ' + PRDCTO_COMBO_BUNDLE_TRES_TECNL;
      }
      name = name + comboBundleTres;
    }

    return name;
  }  
}
