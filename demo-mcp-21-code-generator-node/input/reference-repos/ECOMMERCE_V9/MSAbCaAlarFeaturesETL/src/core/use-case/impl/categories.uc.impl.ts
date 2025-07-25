import * as APM from '@claro/general-utils-library';
import { IParam } from '@claro/generic-models-library';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import generalConfig from '../../../common/configuration/general.config';
import Logging from '../../../common/lib/logging';
import Traceability from '../../../common/lib/traceability';
import { EFamily, filterCategorieType, filterPricesType } from '../../../common/utils/enums/categories.enum';
import { Etask, ETaskDesc, ETaskTrace } from '../../../common/utils/enums/taks.enum';
import GeneralUtil from '../../../common/utils/GeneralUtil';
import { ITaskError } from '../../../core/entity/service-error/task-error.entity';
import { ICategoriesProvider } from '../../../data-provider/categories.provider';
import { IParamProvider } from '../../../data-provider/param.provider';
import { IParentsProvider } from '../../../data-provider/parents.provider';
import { ICatalog, IFindParents } from '../../entity/catalog.entity';
import { IFeaturesToMapping, IMappingFeature, IParents } from '../../entity/categories/category.entity';
import { IFilterCategorie } from '../../entity/categories/filter-category.entity';
import { ICategoriesUC } from '../categories.uc';
import { IServiceErrorUc } from '../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../resource/service-tracing.resource.uc';


/**
 * Clase con la funcionalidad de la actualización de caracteristicas
 * @author Santiago Vargas
 */
@Injectable()
export class CategoriesUCImpl implements ICategoriesUC {
  private readonly logger = new Logging(CategoriesUCImpl.name);

  constructor(
    public readonly _categorieProvider: ICategoriesProvider,
    public readonly _paramsProvider: IParamProvider,
    public readonly _serviceError: IServiceErrorUc,
    private readonly _serviceTracing: IServiceTracingUc,
    private readonly _parentsProvider: IParentsProvider,

    @Inject('KAFKA') private readonly kafka: ClientProxy
  ) { }

  /**
   * Operación para actualizar las caracteristicas
   * @param {Object} categories Categorias que se utilizaran para el proceso de actualización
   * @returns {object} Respuesta de la función
   */
  async updateFeatures(categories: IParam) {
    try {
      await this._parentsProvider.deleteCollection();
      for (const category of categories.values) {
        if (category.status) {
          this.logger.write(`INICIA EL MAPEO DE CARACTERISTICAS => ${category.Family}`, Etask.MAP_FEATURES);

          let filter: IFilterCategorie = {
            family: category.Family,
            type: filterCategorieType
          }

          let filterPrices: IFilterCategorie = {
            family: category.Family,
            type: filterPricesType
          }

          let features = await this._categorieProvider.getContingency(filter);
          let prices = await this._categorieProvider.getContingency(filterPrices);

          if (features.length > 0 && prices.length > 0) {
            const ALL_PRICES = prices.flatMap(price => price.data.getProductOfferingResponse);

            let featuresMapping = await this._paramsProvider.getFeaturesEnabled(category.Family);
            let featuresEnabled = await this.getFeaturesByFamily(featuresMapping);

            this.logger.write("LIMPIANDO COLECCIONES", Etask.DELETE_FEATURES);
            await this.deleteCollections(category.Family);
            
            this.logger.write(`ACTUALIZANDO CARACTERISTICAS => ${category.Family}`, Etask.UPDATE_FEATURES);
            for (const { data } of features) {
              let crossData = await this.crossDataPrices(ALL_PRICES, data.getProductOfferingResponse);
              let saveData = await this.mapFeatures(crossData, featuresEnabled, category.Family);

              await this.dataFlows(saveData, category);
            }

            this.logger.write(`CARACTERISTICAS ACTUALIZADAS => ${category.Family}`, Etask.UPDATE_FEATURES);

            await this.startParents(category.Family)

            await this._categorieProvider.updateRegulatoryFeatures(category.Family);
          }
        }
      }

      await this.onFeatureCalendarAlarmEvent({ "service": "MSAbCaAlarFeaturesETL", "status": "Created" });

      let traceability = new Traceability({ origin: `${generalConfig.apiVersion}${generalConfig.controllerCategories}` });
      traceability.setStatus(ETaskTrace.SUCCESS);
      traceability.setDescription(Etask.END_UPDATE_FEATURES);
      traceability.setTask(ETaskDesc.FINAL_FEATURES_UPDATE);
      await this._serviceTracing.createServiceTracing(traceability.getTraceability());
      this.logger.write('Fin actualización de caracteristicas', Etask.UPDATE_FEATURES);

    } catch (error) {
      this.logger.write(error.message + ":  ERROR: " + JSON.stringify(error.stack), Etask.UPDATE_FEATURES);
      let task: ITaskError = {
        name: Etask.UPDATE_FEATURES,
        description: ETaskDesc.ERROR_UPDATE_FEATURES
      }
      await this._serviceError.createServiceError(error, task);
    }
  }

  /**
   * Operación para filtrar la data de tecnologia
   * @param {Object} categoriesProduct Carcateristicas obetnidas de base de datos para filtrar
   * @param {Object} saveData Caracteristicas de tecnologia antes de guardarla
   * @param {String} category Categoría del flujo para validar
   */
  private async dataFlows(saveData: any, category: any): Promise<any>{
    try {
      switch (category.Family) {
        case "Terminales":
        case "Tecnologia":
          await this.saveFeatures(saveData, category.Family);          
          break;
        }
    } catch (error) {
      this.logger.write(error.message + ":  ERROR: " + JSON.stringify(error.stack), Etask.UPDATE_FEATURES);
      let task: ITaskError = {
        name: Etask.UPDATE_FEATURES,
        description: ETaskDesc.ERROR_UPDATE_FEATURES
      }
      await this._serviceError.createServiceError(error, task);      
    }
  }

  /**
   * Operación para iniciar la agrupacion padres e hijos
   * @param {string} family Categoria de las caracteristicas
   */
   async startParents(family: string) {
    try {
      if (family == EFamily.EQUIPMENT || family == EFamily.TECHNOLOGY) {
        this.logger.write(`INICIA AGRUPACION PADRES E HIJOS => ${family}`, Etask.LIST_PARENTS);
        const DATA_FEATURES = await this._categorieProvider.findCollections(family)
        await this.getData(DATA_FEATURES, family);
      }
    } catch (error) {
      this.logger.write(`getData() | ${ETaskDesc.ERROR_GROUP_PRODUCTS}`, Etask.LIST_PARENTS);

      let task: ITaskError = {
        name: Etask.CREATE,
        description: ETaskDesc.ERROR_GROUP_PRODUCTS
      }
      await this._serviceError.createServiceError(error, task);
    }

  }

  /**
   * Operación para cruzar información entre precios y caracteristicas
   * @param {Object} prices Arreglo con los precios 
   * @param {Object} products Arreglo con los productos y caracteristicas
   * @returns {Object} Arreglo con los productos que tienen precios
   */
  private async crossDataPrices(prices: any, products: any): Promise<any> {
    try {
      let crossData = [];

      for (const product of products) {
        let dataPrice = prices.filter(price => price.id == product.id);
        dataPrice && dataPrice.length > 0 && crossData.push(product);
      }

      return crossData;
    } catch (error) {
      this.logger.write(error.message + ":  ERROR: " + JSON.stringify(error.stack), Etask.CROSS_DATA);
      let task: ITaskError = {
        name: Etask.CROSS_DATA,
        description: ETaskDesc.ERROR_CROSS_DATA
      }
      await this._serviceError.createServiceError(error, task);
    }
  }

  /**
   * Operación para mapear las caracteristicas
   * @param {Object} characteristics Caracteristicas obtenidas del servicio rest o contingencia
   * @param {Object} featuresEnabled Caracteristicas habilitadas
   * @param {String} family Categoría del flujo para validar
   * @returns {Object} Caracteristicas a guardar
   */
  private async mapFeatures(characteristics: any, featuresEnabled: any, family: string): Promise<IMappingFeature[]> {
    try {
      let saveData = [];
      const { values: paramsTipoProductoToValid } = await this._paramsProvider.getParamByIdParam('TipoProducto')

      for (const feature of characteristics) {
        let elementToSave = {
          id: feature.versions[0].id,
          partNumber: feature?.versions[0]?.id,
          name: null,
          description: feature?.versions[0]?.description,
          features: [],
          fullImage: null,
          thumbnail: null,
          URLKeyword: null
        };
        let isValidToSave = true;
  
        const SKU = (feature.versions[0].id).replace(/[a-zA-Z_]/g, '')
        elementToSave.fullImage = `${generalConfig.urlImage}${generalConfig.sizeFullImage}/${SKU}.jpg`;
        
        elementToSave.name = await this.getName(feature, family);

        elementToSave.URLKeyword = await this.getUrlKeyword(elementToSave.name);
        let featuresMap = await this.getFeaturesMap(featuresEnabled, family, feature)

        elementToSave.features = featuresMap;
        
        if (family == EFamily.EQUIPMENT) {
          elementToSave.thumbnail = this.getThumbnail(feature);
        }
        if (family == EFamily.TECHNOLOGY) {
          elementToSave.thumbnail = await this.getThumbnailTechnology(feature);
          isValidToSave = await this.isValidToSave(
            paramsTipoProductoToValid, 
            elementToSave.features, 
          )
        }
        if(isValidToSave) saveData.push(elementToSave);
      }

      return saveData;
    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.MAP_FEATURES);
      let task: ITaskError = {
        name: Etask.MAP_FEATURES,
        description: ETaskDesc.ERROR_MAP_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón mapear las caracteristicas', task);
    }
  }

    /**
   * Operación para filtrar tipo producto
   * @param {String} paramsTipoProductoToValid parms de base de dato
   * @param {String} features caracteristica a filtrar
   */
    private async isValidToSave(paramsTipoProductoToValid: string[], features: any): Promise<boolean>{
      const tipoProductoValue = features.filter(feature => feature.id.trim() === 'TIPO_PRODUCTO')
      return !(paramsTipoProductoToValid.includes(tipoProductoValue[0]?.value.replace(/\s+/g, '')))
    }
  
  /**
   * Operación para mapear la UrlKeyword de las caracteristicas
   * @param {String} name Nombre obtenido de las caracteristicas
   * @returns {String} URlkeyword a mapear
   */
  private async getUrlKeyword(name: any): Promise<any>{
    try {

      let finalUrlKeyword;
      
      if(name != undefined){
        finalUrlKeyword = name.toLowerCase();
        return finalUrlKeyword.replace(/[_=?#/.%;,:@&+$!~*'() ]/g, "-");
      }

    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.MAP_URLKEYWORD);
      let task: ITaskError = {
        name: Etask.MAP_URLKEYWORD,
        description: ETaskDesc.ERROR_MAP_URLKEYWORD_FEATURES
      }
      await this._serviceError.createServiceError('No se pudo crear el campo UrlKeyword', task);      
    }
  }

  /**
   * Operación para mapear el nombre de las caracteristicas
   * @param {Object} feature Caracteristicas obtenidas del servicio rest o contingencia
   * @param {String} family Categoría del flujo para validar
   * @returns {Object} Caracteristica mapeada
   */
  private async getName(feature: any, family: string): Promise<any>{
    try {
      let name = "";
      switch (family) {
        case EFamily.EQUIPMENT:
          const NOMBRE_COMERCIAL = feature.versions[0].characteristics.filter((nameComercial: any) => nameComercial.id == "NOMBRE_COMERCIAL")[0].versions[0].value;
          const NOMBRE_TECNOLOGIA = feature.versions[0].characteristics.filter((bandas: any) => bandas.id == "TECNOLOGIA")[0].versions[0].value;
          const OBSEQUIO = feature.versions[0].characteristics.filter((obsequio: any) => obsequio.id == "OBSEQUIO")[0].versions[0].value;

          if (NOMBRE_COMERCIAL){
            if(NOMBRE_TECNOLOGIA != "NA"){
              let regex = /(\d+)/g;
              let nombreTecnologia = NOMBRE_TECNOLOGIA.match(regex);
              let nombrefinalTecnologia = nombreTecnologia.pop();
              name = NOMBRE_COMERCIAL + " " + nombrefinalTecnologia + "G";

              OBSEQUIO && OBSEQUIO != "NA" &&
              (name = `${name} Gratis ${OBSEQUIO}`);
              
            }else{
              name = NOMBRE_COMERCIAL + " " + "G";

              OBSEQUIO && OBSEQUIO != "NA" &&
              (name = `${name} Gratis ${OBSEQUIO}`);
            }
            
          }
          return name;

        case EFamily.TECHNOLOGY:
          return GeneralUtil.createNameForTechnology(feature);

      }
      
    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.MAP_NAME);
      let task: ITaskError = {
        name: Etask.MAP_NAME,
        description: ETaskDesc.ERROR_MAP_NAME_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón mapear las caracteristicas', task);      
    }

  }

  /**
   * Operación para mapear el valor de las caracteristicas
   * @param {Object} feature Caracteristicas obtenidas del servicio rest o contingencia
   * @param {Object} featuresEnabled Caracteristicas habilitadas
   * @param {String} family Categoría del flujo para validar
   * @returns {Object} Caracteristicas a guardar
   */
  private async getFeaturesMap(featuresEnabled: any, family: string, feature: any): Promise<any> {
    try {
      let featuresMap = [];
      featuresEnabled.forEach(async (featureAvailable: any) => {
        let featureSave = {};

        if (featureAvailable.id == "specificationSubtype") {
          featureSave = {
            id: featureAvailable.id,
            name: featureAvailable.name,
            value: (family != EFamily.TECHNOLOGY) ? feature.versions[0].specificationSubtype : feature.versions[0].specificationType
          };

          featuresMap.push(featureSave);
        } else {
          featureSave = await this.getFeatureSave(feature, featureAvailable, family);
          featureSave && featuresMap.push(featureSave);
        }
      })
      return featuresMap
    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.MAP_FEATURES);
      let task: ITaskError = {
        name: Etask.MAP_FEATURES,
        description: ETaskDesc.ERROR_MAP_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón mapear las caracteristicas', task);
    }

  }

  /**
   * Operación para obtener la caracteristica mapeada
   * @param {Object} feature Objeto con las caracteristicas de cada po
   * @param {Object} featureAvailable Objecto con la caracteristica habilitada
   * @param {String} family Categoría del flujo para validar
   * @returns {Object} Caracteristica mapeada
   */
  private async getFeatureSave(feature: any, featureAvailable: any, family: string): Promise<IFeaturesToMapping> {
    try {
      for (const featureContingency of feature.versions[0].characteristics) {
        if (featureAvailable.id == featureContingency.id) {
          return {
            id: featureAvailable.id,
            name: (family == EFamily.EQUIPMENT || family == EFamily.TECHNOLOGY) ? featureContingency.versions[0].name : featureContingency.name,
            value: (family == EFamily.EQUIPMENT || family == EFamily.TECHNOLOGY) ? featureContingency.versions[0].value : featureContingency.value
          }
        }
      }
    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.MAP_FEATURES);
      let task: ITaskError = {
        name: Etask.MAP_FEATURES,
        description: ETaskDesc.ERROR_MAP_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón mapear las caracteristicas', task);
    }
  }

  /**
   * Operación para obtener las caracteristicas habilitadas por flujo
   * @param {Object} featuresMapping Caracteristicas a mapear
   * @returns {Object} Caracteristicas habilitadas por flujo
   */
  private async getFeaturesByFamily(featuresMapping: any): Promise<IFeaturesToMapping[]> {
    try {
      let featuresEnabled = [];

      for (const feature of Object.entries(featuresMapping.values[0].Characteristics)) {
        featuresEnabled.push({
          id: feature[0],
          name: feature[0],
          value: ""
        })
      }

      return featuresEnabled;
    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.MAP_FEATURES);
      let task: ITaskError = {
        name: Etask.MAP_FEATURES,
        description: ETaskDesc.ERROR_MAP_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón obtener las caracteristicas', task);
    }
  }

  /**
   * Operación para guardar las nuevas caracteristicas
   * @param {Object} data Nuevas caracteristicas para guardar
   * @param {String} family Categoría del flujo para guardar
   * @returns {Boolean} Confirmación del guardado de las caracteristicas
   */
  private async saveFeatures(data: IMappingFeature[], family: string): Promise<any> {
    try {      
      return await this._categorieProvider.updateFeatures(data, family);

    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.INSERT_FEATURES);
      let task: ITaskError = {
        name: Etask.INSERT_FEATURES,
        description: ETaskDesc.ERROR_INSERT_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón insertar las caracteristicas', task);
    }
  }

  /**
   * Operación para limpiar o borrar las colecciones
   * @param {String} family Categoría del flujo para borrar
   * @returns {Boolean} Confirmación de la eliminación
   */
  private async deleteCollections(family: string): Promise<any> {
    try {
      return await this._categorieProvider.deleteCollections(family);
    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.DELETE_FEATURES);
      let task: ITaskError = {
        name: Etask.DELETE_FEATURES,
        description: ETaskDesc.ERROR_DELETE_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón borrar las caracteristicas', task);
    }
  }

  /**
   * Operación para obtener la ruta de la imagen
   * @param {Object} feature Objeto con las caracteristicas de cada po
   * @returns {String} Ruta de la imagen
   */
  private getThumbnail(feature: any): string {
    try {
      let nombreComercial = feature.versions[0].characteristics.filter((comercial: any) => comercial.id == "NOMBRE_COMERCIAL");
      let valueBandas = feature.versions[0].characteristics.filter((bandas: any) => bandas.id == "TECNOLOGIA");
      let valueColor = feature.versions[0].characteristics.filter((color: any) => color.id == "Color");
      let valueObsequio = feature.versions[0].characteristics.filter((obsequio: any) => obsequio.id == "OBSEQUIO");

      nombreComercial = (nombreComercial && nombreComercial.length > 0 && nombreComercial[0].versions[0].value != null)
        ? ((nombreComercial[0].versions[0].value).replace(/[^a-zA-Z0-9 ]/g, '')).replace(/\s/g, '-')
        : 'na';

      valueBandas = (valueBandas && valueBandas.length > 0 && valueBandas[0].versions[0].value != null)
        ? this.getBands(valueBandas[0].versions[0].value).replace('.', '')
        : 'na';

      valueColor = (valueColor && valueColor.length > 0 && valueColor[0].versions[0].value != null)
        ? (valueColor[0].versions[0].value).replace(/\s/g, '-')
        : 'na';

      let urlImage = '';

      if (valueObsequio.length > 0 && (valueObsequio[0].versions[0].value != '' && valueObsequio[0].versions[0].value != 'NA' && valueObsequio[0].versions[0].value != null)) {
        valueObsequio = ((valueObsequio[0].versions[0].value).replace(/[^a-zA-Z0-9 ]/g, '')).replace(/\s/g, '-');

        urlImage = (`${nombreComercial}-${valueObsequio}-${valueBandas}-${valueColor}.jpg`).toLocaleLowerCase();
      } else {
        urlImage = (`${nombreComercial}-${valueBandas}-${valueColor}.jpg`).toLocaleLowerCase();
      }

      return `${generalConfig.urlImage}${generalConfig.sizeThumbnail}/${urlImage}`;

    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.CREATE_IMAGES);
      let task: ITaskError = {
        name: Etask.MAP_FEATURES,
        description: ETaskDesc.ERROR_MAP_FEATURES
      }
      this._serviceError.createServiceError('No se pudierón crear las imagenes', task);
    }
  }

  /**
   * Operación para obtener la ruta de la imagen
   * @param {Object} feature Objeto con las caracteristicas de cada po
   * @returns {String} Ruta de la imagen
   */
  private async getThumbnailTechnology(feature: any): Promise<any> {
    try {
      let nombreComercial = feature.versions[0].characteristics.filter((comercial: any) => comercial.id == "NOMBRE_COMERCIAL_TECNLG");
      let valueColor = feature.versions[0].characteristics.filter((color: any) => color.id == "Color");
      let productoBundle = feature.versions[0].characteristics.filter((bundle: any) => bundle.id == "PRODUCTO_COMBO_BUNDLE");
      let prodctoTwoBundle = feature.versions[0].characteristics.filter((bundle: any) => bundle.id == "PRDCTO_COMBO_BUNDLE_DOS_TECNLG");
      let prodctoThreeBundle = feature.versions[0].characteristics.filter((bundle: any) => bundle.id == "PRDCTO_COMBO_BUNDLE_TRES_TECNL");

      nombreComercial = (nombreComercial && nombreComercial.length > 0 && nombreComercial[0].versions[0].value != null)
        ? ((nombreComercial[0].versions[0].value).replace(/[^a-zA-Z0-9 ]/g, '')).replace(/\s/g, '-')
        : 'na';

      valueColor = (valueColor && valueColor.length > 0 && valueColor[0].versions[0].value != null)
        ? (valueColor[0].versions[0].value).replace(/\s/g, '-')
        : 'na';

      let urlImage = '';

      if (productoBundle.length > 0 && (productoBundle[0].versions[0].value != '' && productoBundle[0].versions[0].value != 'NA' && productoBundle[0].versions[0].value != null)) {
        productoBundle = ((productoBundle[0].versions[0].value).replace(/[^a-zA-Z0-9 ]/g, '')).replace(/\s/g, '-');
        urlImage = (`${nombreComercial}-${valueColor}-${productoBundle}.jpg`).toLocaleLowerCase();

      } else if (prodctoTwoBundle.length > 0 && (prodctoTwoBundle[0].versions[0].value != '' && prodctoTwoBundle[0].versions[0].value != 'NA' && prodctoTwoBundle[0].versions[0].value != null)) {

        prodctoTwoBundle = ((prodctoTwoBundle[0].versions[0].value).replace(/[^a-zA-Z0-9 ]/g, '')).replace(/\s/g, '-');
        urlImage = (`${nombreComercial}-${valueColor}-${prodctoTwoBundle}.jpg`).toLocaleLowerCase();

      } else if (prodctoThreeBundle.length > 0 && (prodctoThreeBundle[0].versions[0].value != '' && prodctoThreeBundle[0].versions[0].value != 'NA' && prodctoThreeBundle[0].versions[0].value != null)) {

        prodctoThreeBundle = ((prodctoThreeBundle[0].versions[0].value).replace(/[^a-zA-Z0-9 ]/g, '')).replace(/\s/g, '-');
        urlImage = (`${nombreComercial}-${valueColor}-${prodctoThreeBundle}.jpg`).toLocaleLowerCase();
      }
      else {
        urlImage = (`${nombreComercial}-${valueColor}.jpg`).toLocaleLowerCase();
      }

      return `${generalConfig.urlImage}${generalConfig.sizeThumbnail}/${urlImage}`;

    } catch (error) {
      this.logger.write(error.message + ":  " + JSON.stringify(error.stack), Etask.CREATE_IMAGES);
      let task: ITaskError = {
        name: Etask.MAP_FEATURES,
        description: ETaskDesc.ERROR_MAP_FEATURES
      }
      await this._serviceError.createServiceError('No se pudierón crear las imagenes', task);
    }
  }

  /**
   * Operación para obtener la banda ancha
   * @param {String} bands Banda ancha del po
   * @returns {String} Banda ancha modificada para la ruta
   */
  private getBands(bands: string): string {
    const BANDS_AVAILABLE = (bands.replace(/G/g, ' ')).split('-');
    const NEW_BAND = BANDS_AVAILABLE.filter(element => !isNaN(parseFloat(element))).map(Number);
    return (NEW_BAND.length > 0 && !isNaN(Math.max(...NEW_BAND))) ? `${Math.max(...NEW_BAND)}g` : 'g';
  }

  /**
   * Operación para obtener los registros para terminales
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @returns 
   */
  private async getData(data: ICatalog[], family: string) {
    try {

      this.logger.write(`CONFIGURANDO DATA PADRES E HIJOS => ${family}`, Etask.LIST_PARENTS);
      
      let featureMap = "OBSEQUIO";
      let featureClasfct = "CLASIFICACION";
      if (family == EFamily.TECHNOLOGY) {
        featureMap = "PRODUCTO_COMBO_BUNDLE";
        featureClasfct = "CLASIFICACION_TECNLG";
      }
      
      let listParents: IParents[] = [];

      let existFeature = data.filter(product => product.features[product.features.findIndex(feature => feature.id == featureClasfct)]);

      const findDatabaseParentes = await this._parentsProvider.findParentsCollection();     
      
      if (existFeature.length > 0) {
        const LIST_CLASIFICACION = [...new Set(data.map(product => product.features[product.features.findIndex(feature => feature.id == featureClasfct)].value))];

        LIST_CLASIFICACION.forEach(clasificacion => {
          if (clasificacion !== "NA") {
            let LIST_PRODUCTS = data.filter(product => product.features[product.features.findIndex(feature => feature.id == featureClasfct)].value === clasificacion);          
           
            const LIST_OBSEQUIO_BUNDLE = [...new Set(
              LIST_PRODUCTS
                .filter(product => product.features.some(feature => feature.id == featureMap && (feature.id == featureMap && feature.value != "NA")))
                .map(product => product.features[product.features.findIndex(feature => feature.id == featureMap)].value)
            )]

            LIST_OBSEQUIO_BUNDLE.forEach(obsequioBundle => {
              const PRODUCTS = LIST_PRODUCTS
                .filter(product => product.features.some(feature => feature.id == featureMap && (feature.id == featureMap && feature.value != "NA")))
                .filter(product => product.features[product.features.findIndex(feature => feature.id == featureMap)].value == obsequioBundle);

              const GROUP_PRODUCTS = this.groupProducts(PRODUCTS, family, findDatabaseParentes);
              GROUP_PRODUCTS.then(function(result) {
                listParents.push(result);
              });
            });

            const LIST_NO_OBSEQUIO = LIST_PRODUCTS.filter(product => {
              return !product.features.some(feature => feature.id == featureMap && (feature.id == featureMap && feature.value != "NA"))
            });
            
            if (LIST_NO_OBSEQUIO && LIST_NO_OBSEQUIO.length > 0) {
                const GROUP_PRODUCTS = this.groupProducts(LIST_NO_OBSEQUIO, family, findDatabaseParentes);
                GROUP_PRODUCTS.then(function(result) {
                  listParents.push(result);
               });
              }
            }
        });

        await this._parentsProvider.saveListParents(listParents);

      }else{
        this.logger.write(`NO SE ENCONTRO DATA CON CLASIFICACION => ${family}`, Etask.LIST_PARENTS);
      }
    } catch (error) {
      this.logger.write(`getData() | ${ETaskDesc.ERROR_GROUP_PRODUCTS}`, Etask.LIST_PARENTS);

      let task: ITaskError = {
        name: Etask.CREATE,
        description: ETaskDesc.ERROR_GROUP_PRODUCTS
      }
      await this._serviceError.createServiceError(error, task);
    }
  }

  /**
   * Operación para obtener los productos agrupados por clasificación y obsequio
   * @param {ICatalog[]} listProducts Productos agrupados por clasificacion y/o obsequio
   * @param familyName Nombre del flujo a crear
   * @param findDatabaseParentes data de padres consultada de mongo
   * @returns {Object} objeto con la agrupacion
   */
  private async groupProducts(listProducts: ICatalog[], familyName: string, findDatabaseParentes: IFindParents[]): Promise<IParents> {
    try {
      const DATA_PARENT = await this.dataParents(familyName, listProducts[0]);
      const FILTERED_PARENTS =  [ ...findDatabaseParentes.filter(parent => parent.family == familyName) ] 

      const filteredData = FILTERED_PARENTS.find(findDataParents => 
        findDataParents.features.every(feature => 
          feature.value == DATA_PARENT.features.find(f => f.id == feature.id).value
        )
      );

      if (filteredData) {
        return {
          parentPartNumber: {
            [filteredData.parentPartNumber]: listProducts.map(product => product.partNumber)
          },
          family: familyName
        };
      } else {
        await this._parentsProvider.saveListParentsCollection(DATA_PARENT);
        return {
          parentPartNumber: {
            [listProducts[0].partNumber]: listProducts.map(product => product.partNumber)
          },
          family: familyName
        };
      }
    } catch (error) {
      this.logger.write(`groupProducts() | ${ETaskDesc.ERROR_GROUP_PRODUCTS} | ${error}`, Etask.LIST_PARENTS, true);

      let task: ITaskError = {
        name: Etask.CREATE,
        description: ETaskDesc.ERROR_GROUP_PRODUCTS
      };
      this._serviceError.createServiceError(error, task);
    }
  }

  /**
   * Operación para obtener los padres de los productos
   * @param familyName Familia de la data a crear
   * @param listProducts Productos agrupados por clasificacion y/o obsequio
   * @returns {Object} objeto con la agrupacion
   */
  private async dataParents(familyName: string, listProducts: ICatalog): Promise<IFindParents> {
    try {
      const featuresMap = {
        [EFamily.EQUIPMENT]: ["CLASIFICACION", "OBSEQUIO"],
        [EFamily.TECHNOLOGY]: [
          "CLASIFICACION_TECNLG",
          "PRODUCTO_COMBO_BUNDLE",
          "PRDCTO_COMBO_BUNDLE_DOS_TECNLG",
          "PRDCTO_COMBO_BUNDLE_TRES_TECNL"
        ]
      };
    
      const selectedFeatures = featuresMap[familyName] || [];
      const features = selectedFeatures.map((id: string) => {
        const feature = listProducts.features.find(f => f.id === id);
        return !feature ? { id, name: id, value: "NA" } : { id: feature.id, name: feature.name, value: feature.value };
      });
    
      return {
        parentPartNumber: listProducts.partNumber,
        family: familyName,
        features
      };
    } catch (error) {
        this.logger.write(`dataParents() | ${ETaskDesc.ERROR_SAVE_LIST_PARENTS}`, Etask.CREATE);      
        throw error
    }
  }

  /**
   * Operación encargada de emitir un evento kafka
   * @param {Object} paiload Mensaje enviado en el evento
   */
  private async onFeatureCalendarAlarmEvent(paiload: any) {
    const transaction = await APM.startTransaction(`onFeatureCalendarAlarmEvent - Kafka`);
    try {
      this.logger.write('onFeatureCalendarAlarmEvent()', Etask.EMIT_KAFKA);
      this.kafka.emit(generalConfig.kafkaTopic, paiload);
    } catch (error) {
      this.logger.write(`onFeatureCalendarAlarmEvent() | ${ETaskDesc.ERROR_EMIT_KAFKA}`, Etask.EMIT_KAFKA);
    }finally {
      transaction.end();
    }
  }
}