/**
 * Clase que maneja la transofrmacion de los datos
 * @author Jose Orellana
 */

import { Injectable } from '@nestjs/common';
import { Readable } from 'stream';
import generalConfig from 'src/common/configuration/general.config';
import Logging from 'src/common/lib/logging';
import { FamilyParams, TypeParams } from 'src/common/utils/enums/params.enum';
import { Etask, ETaskDesc } from 'src/common/utils/enums/taks.enum';
import {
  EDescriptionTracingGeneral,
  EStatusTracingGeneral,
  ETaskTracingGeneral,
} from 'src/common/utils/enums/tracing.enum';
import { IFeatureProvider } from 'src/data-provider/provider/feature/transform-feature.provider';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { ITransformFeatureUc } from '../transform-feature.uc.';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import utils from 'src/common/utils/GeneralUtil';
import { DisponibiltyEnum } from 'src/common/utils/enums/disponibility.enum';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { IParamProvider } from 'src/data-provider/param.provider';
import { ICatalogUc } from '../../catalog/catalog.uc';
import { ICharacteristics } from 'src/core/entity/product-offering/product-offering.entity';
import {
  ICharacteristicsTerminales,
  IProcessTyC,
  ITermsConditions,
} from 'src/core/entity/catalog/terms-conditions.entity';

@Injectable()
export class TransformFeatureImplUC implements ITransformFeatureUc {
  constructor(
    private readonly featuresProvider: IFeatureProvider,
    private readonly _catalogProvider: ICatalogUc,
    public readonly _serviceTracing: IServiceTracingUc,
    public readonly _GetErrorTracing: IGetErrorTracingUc,
    public readonly _IParamProvider: IParamProvider,
  ) { }

  private readonly logger = new Logging(TransformFeatureImplUC.name);

  /**
   * se hace una lecutra de la coleccion para traer los datos segun la categoria y se divide para hacer
   * una insercion paginada en la coleccion COLPRTPRODUCTOFFERING
   * @param {string}categoria objeto con la informacion de la categoria tratar
   */
  async transformOriginalData(categoria: FamilyParams): Promise<any> {
    try {
      this.logger.write(
        `transformOriginalData() - Inicio transformacion data => ${categoria}`,
        Etask.TRANSFORM_DATA,
      );

      let finalMaterial = {
        params: {
          family: FamilyParams.equipment,
          type: TypeParams.feature,
          Page: 1,
        },
        data: {
          getProductOfferingResponse: [],
        },
      };

      const dataOriginal = await this._catalogProvider.getDataAttributes(categoria);
      const dataSkuException = await this._catalogProvider.getDataSkuException(categoria);

      let finalData = await this.crossoverExpAttr(
        dataSkuException,
        dataOriginal,
      );
      const sizeData = await finalData.length;
      const division = generalConfig.paginationDB;
      let numPage = 1;

      dataSkuException.length = 0;

      await this.featuresProvider.deleteDataColPrtProductOffering(
        finalMaterial.params,
        categoria,
      );

      this.logger.write(
        `transformOriginalData() - Inicio transformacion caracteristicas => ${categoria}`,
        Etask.TRANSFORM_DATA,
      );

      let poTecnologia = finalData.filter((x: any) =>
        x.id.includes(DisponibiltyEnum.PO_TECHNOLOGY),
      );
      if (poTecnologia != 0) {
        finalMaterial.params.family = FamilyParams.technology;
      }

      const featuresMapping = await this._IParamProvider.getFeaturesEnabled(categoria);
      const allTermnsConditions: ITermsConditions[] = await this._catalogProvider.getAllTermsConditions();


      const readable = new Readable({
        objectMode: true,
        read() {
          let i = 0;
          while (i < sizeData) {
            const chunk = finalData.slice(i, i + division);
            this.push(chunk);
            i += division;
          }
          this.push(null);
        }
      });


      

      for await (const chunk of readable) {

        finalData.length = 0;

        finalMaterial.data.getProductOfferingResponse =
          await this.sortOriginalData(chunk, categoria, featuresMapping, allTermnsConditions);
        finalMaterial.params.Page = numPage;
        numPage++; 
        await this.featuresProvider.saveData(finalMaterial);
        finalMaterial.data.getProductOfferingResponse = [];
      }

      

      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.STATUS_SUCCESS,
        `${EDescriptionTracingGeneral.FEATURES_COLL_COLPRTPRODUCTOFFERING} - ${categoria}`,
        ETaskTracingGeneral.SAVE_DATA,
      );
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_FEATURES_LOAD_PROCESS,
        ETaskTracingGeneral.FILE_TRANSFORM,
      );
      this.logger.write(
        'transformOriginalData() ' + error.tasks,
        Etask.TRANSFORM_DATA,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.TRANSFORM_DATA,
        ETaskDesc.TRANSFORM_DATA,
      );
      await this._GetErrorTracing.getError(error, categoria);
    }
  }

  /**
   * Funcion para transformar las caracteristicas de cada PO
   * @param {*}data caracteristicas sin transformar
   * @param {string}categoria del flujo (Terminales o Tecnologia)
   * @param {*}featuresMapping caracteristicas a transformar
   * @param {*}allTermnsConditions terminos y condiciones
   * @returns {*} Objeto con las caracteristicas tranfirmadas
   */
  async sortOriginalData(
    data: any,
    categoria: FamilyParams,
    featuresMapping: any,
    allTermnsConditions: ITermsConditions[],
  ): Promise<any> {
    try {
      if (featuresMapping == undefined || featuresMapping == null) {
        this.logger.write(
          'No se encontro data de caracteristicas ',
          Etask.TRANSFORM_DATA,
          ELevelsErros.WARNING,
        );
        return null;
      }

      return data.map((element) =>
        this.getCategoryCharacteristics(
          element,
          categoria,
          featuresMapping.values[0].Characteristics,
          allTermnsConditions,
        ),
      );
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_FEATURES_LOAD_PROCESS,
        ETaskTracingGeneral.FILE_TRANSFORM,
      );
      this.logger.write(
        'transformOriginalData() ' + error.tasks,
        Etask.TRANSFORM_DATA,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.TRANSFORM_DATA,
        ETaskDesc.TRANSFORM_DATA,
      );
      await this._GetErrorTracing.getError(error, categoria);
    }
  }

  /**
   *
   * @param element
   * @param categoria se manda la categoria que va a ser filtrada sobre el enums nameIdEquipTec.enum.ts
   * @returns
   */
  getCategoryCharacteristics = (
    element: any,
    categoria: FamilyParams,
    featuresMapping: any,
    allTermnsConditions: ITermsConditions[],
  ) => {
    try {
      const characteristics: ICharacteristics[] =
        element.versions[0].characteristics;

      const caracteristicasTabla = [];

      if (categoria === FamilyParams.equipment) {
        element.versions[0].specificationSubtype =
          generalConfig.specificationSubtype;
      } else if (categoria === FamilyParams.technology) {
        const modeloEquipos = characteristics.find(
          (caracteristica) => caracteristica.id === 'specificationSubtype',
        );
        if (modeloEquipos) {
          element.versions[0].specificationSubtype =
            modeloEquipos.versions[0].value;
        }
      }

      characteristics.forEach((caracteristica) => {
        if (caracteristica.id in featuresMapping) {
          const {
            caracteristica: caracteristicaToSave,
            newCharacteristicToAdd,
          } = this.characteristicsTerminales({
            caracteristica,
            featuresMapping,
            allTermnsConditions,
            categoria,
            characteristics,
            element
          });

          caracteristicasTabla.push(caracteristicaToSave);
          if (caracteristica.id === 'MARCA') {
            caracteristicasTabla.push(
              ...(newCharacteristicToAdd as ICharacteristics[]),
            );
          }
        }
      });
      element.versions[0].characteristics = caracteristicasTabla;

      return element;
    } catch (error) {
      this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS,
        ETaskTracingGeneral.FILE_TRANSFORM,
      );
      this.logger.write(
        'getCategoryCharacteristics() ' + error.tasks,
        Etask.TRANSFORM_DATA,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.TRANSFORM_DATA,
        ETaskDesc.TRANSFORM_DATA,
      );
      this._GetErrorTracing.getError(error, categoria);
    }
  };

  async crossoverExpAttr(dataSku: any, dataDisp: any) {
    try {
      this.logger.write(`Inicio cruce excepciones sku`, Etask.EXCEPTION_SKU);

      dataSku.forEach((sku: any) => {
        dataDisp.forEach((ele: any) => {
          if (ele.filter == sku.filter) {
            let indice = dataDisp.indexOf(ele);
            dataDisp.splice(indice, 1);
          }
        });
      });
      return dataDisp;
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.ERROR_FIND_EXCEPCIONES,
        ETaskTracingGeneral.FIND_EXCEPCIONES,
      );
      this.logger.write(
        'crossoverExpAttr() ' + error.tasks,
        Etask.TRANSFORM_DATA,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.TRANSFORM_DATA,
        ETaskDesc.TRANSFORM_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  /**
   *
   * @param value  valor que viene de la coleccion para ser evaluado, si es vacio o ? se coloca NA y si no
   * se deja el valor que ya tenia dicho registro
   * @returns
   */
  private putNavalues(value: string) {
    return value === '' || value === '?' ? 'NA' : value;
  }

  /**
   * Remplaza los caracterestes'_' por espacios al valor de la caracteristica
   * @param value valor caracteristica
   * @returns valor transformado
   */
  private putNombreComercialvalue(value: string) {
    return value.replace(/_/g, ' ');
  }

  /**
   * Se traen las caracteristcas de terminales de la coleccion para ser transformadas
   * @param caracteristica valor que viene para ser procesado
   * @returns caracteristica ya transformada
   */
  private characteristicsTerminales({
    caracteristica,
    featuresMapping,
    allTermnsConditions,
    categoria,
    characteristics,
    element
  }: ICharacteristicsTerminales) {
    try {
      /**
       * se hace una validacion para cuando las caracteristicas tienen vacio o "?" como valor
       * solo si existe  en el enum de caracteristicas
       */
      caracteristica.versions[0].value = this.putNavalues(
        caracteristica.versions[0].value,
      );
      caracteristica.versions[0].name = featuresMapping[caracteristica.id];
      if (caracteristica.id === 'COLOR') {
        caracteristica.id = 'Color';
        caracteristica.versions[0].name = 'Color';
        caracteristica.versions[0].value =
          caracteristica.versions[0].value.toUpperCase();
      }
      if (
        caracteristica.id === 'NOMBRE_COMERCIAL' ||
        'OBSEQUIO' ||
        'NOMBRE_COMERCIAL_TECNLG' ||
        'PRDCTO_COMBO_BUNDLE_DOS_TECNLG' ||
        'PRODUCTO_COMBO_BUNDLE' ||
        'PRDCTO_COMBO_BUNDLE_TRES_TECNL'
      ) {
        caracteristica.versions[0].value = this.putNombreComercialvalue(
          caracteristica.versions[0].value,
        );
      }

      const newCharacteristicToAdd = this.proccessTyC({
        caracteristica,
        allTermnsConditions,
        categoria,
        characteristics,
        element
      });

      return { caracteristica, newCharacteristicToAdd };
    } catch (error) {
      this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.START_FEATURES_TRANSFORM_PROCESS,
        ETaskTracingGeneral.FILE_TRANSFORM,
      );
      this.logger.write(
        'characteristicsTerminales() ' + error.tasks,
        Etask.TRANSFORM_DATA,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.TRANSFORM_DATA,
        ETaskDesc.TRANSFORM_DATA,
      );
      this._GetErrorTracing.getError(error);
    }
  }

  private proccessTyC({
    caracteristica,
    allTermnsConditions,
    categoria,
    characteristics,
    element
  }: IProcessTyC): {} | ICharacteristics[] {
    if (caracteristica.id != 'MARCA') return {};

    const newCharacteristicsToAdd: ICharacteristics[] = [
      {
        id: 'caja_b_desc',
        versions: [
          {
            name: 'caja_b_desc',
            value: ' ',
          },
        ],
      },
      {
        id: 'caja_b_nombre',
        versions: [
          {
            name: 'caja_b_nombre',
            value: 'Terminos y Condiciones',
          },
        ],
      },
    ];

    let nombreProducto = this.createNameAccordingToCategory(
      categoria,
      characteristics,
    );

    let tyc = ' ';

    for (const termCondition of allTermnsConditions) {

      const { Referencia, 'Rango de fecha': rangoFecha, Unidades, Marca, 'T&C': tycTemplate } = termCondition;

      // CASO 1: Cuando existe referencia

      if (Referencia && rangoFecha) {
        const refIds = Referencia.split(',');

        if (refIds.includes(element.id + 'P') || (!Unidades && refIds.includes(element.id + 'P'))) {

          tyc = tycTemplate
            .replace('Rangodefecha', rangoFecha)
            .replace('Unidad', Unidades || '20')
            .replace('NombreProducto', nombreProducto);

          newCharacteristicsToAdd[0].versions[0].value = tyc;

        }

      }
      // CASO 2: Cuando no existe referencia

      if (!Referencia && rangoFecha && Marca.toLowerCase() === caracteristica?.versions[0]?.value.toLowerCase()) {

        tyc = tycTemplate
          .replace('Rangodefecha', rangoFecha)
          .replace('Unidad', Unidades || '20')
          .replace('NombreProducto', nombreProducto);


        newCharacteristicsToAdd[0].versions[0].value = tyc;

      }

    }
    return newCharacteristicsToAdd;
  }

  private createNameAccordingToCategory(
    categoria: FamilyParams,
    characteristics: ICharacteristics[],
  ): any {
    const validations = ['NA', 'NO', ''];
    let nombreProducto = '';
    if (categoria === FamilyParams.equipment) {
      const nombreComercial = characteristics.find(
        (characteristic) => characteristic.id === 'NOMBRE_COMERCIAL',
      );
      const obsequio = characteristics.find(
        (characteristic) => characteristic.id === 'OBSEQUIO',
      )?.versions[0]?.value;

      nombreProducto = nombreComercial?.versions[0]?.value;

      if (!validations.includes(obsequio.toUpperCase())) {
        nombreProducto =
          nombreProducto + ' gratis ' + obsequio
      }
    }

    if (categoria === FamilyParams.technology) {
      const nombreComercialTecnologia = characteristics.find(
        (characteristic) => characteristic.id === 'NOMBRE_COMERCIAL_TECNLG',
      )?.versions[0]?.value;
      const productoComboBundle = characteristics.find(
        (characteristic) => characteristic.id === 'PRODUCTO_COMBO_BUNDLE',
      )?.versions[0]?.value;
      const productoComboBundleDosTecnologia = characteristics.find(
        (characteristic) =>
          characteristic.id === 'PRDCTO_COMBO_BUNDLE_DOS_TECNLG',
      )?.versions[0]?.value;
      const productoComboBundleTresTecnologia = characteristics.find(
        (characteristic) =>
          characteristic.id === 'PRDCTO_COMBO_BUNDLE_TRES_TECNL',
      )?.versions[0]?.value;

      nombreProducto = nombreComercialTecnologia;

      const isProductoComboBundleValid =
        !!productoComboBundle &&
        !validations.includes(productoComboBundle.toUpperCase());

      if (isProductoComboBundleValid) {
        nombreProducto = nombreProducto + ' con ' + productoComboBundle;
      }

      const isProductoComboBundleDosTecnologiaValid =
        !!productoComboBundleDosTecnologia &&
        !validations.includes(productoComboBundleDosTecnologia.toUpperCase());

      if (isProductoComboBundleDosTecnologiaValid) {
        nombreProducto =
          nombreProducto + ' más ' + productoComboBundleDosTecnologia;
      }

      const isProductoComboBundleTresTecnologiaValid =
        !!productoComboBundleTresTecnologia &&
        !validations.includes(productoComboBundleTresTecnologia.toUpperCase());

      if (isProductoComboBundleTresTecnologiaValid) {
        nombreProducto =
          nombreProducto + ' y ' + productoComboBundleTresTecnologia;
      }
    }

    return nombreProducto.replace(/_/g, ' ');
  }
}
