/**
 * Clase para construcción logica de negocio metodo creación dataload attributes-dictionay
 * @author Santiago Vargas
 */

import { Injectable } from '@nestjs/common';
import generalConfig from '../../../../common/configuration/general.config';
import Logging from '../../../../common/lib/logging';
import find from '../../../../common/utils/UtilConfig';
import CreateCsv from '../../../../common/utils/createCsv';
import { ECategoriesDataload } from '../../../../common/utils/enums/categories-dataload.enum';
import { ETaskDesc, Etask } from '../../../../common/utils/enums/taks.enum';
import { IAttributesDictionary } from '../../../../core/entity/catalog/attributes-dictionary.entity';
import { ECategory, ICatalog, IFeatures } from '../../../../core/entity/catalog/catalog.entity';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IAttributesDictionaryUC } from '../attributes-dictionary.uc';
import generalUtil from '../../../../common/utils/generalUtil';

@Injectable()
export class AttributesDictionaryUC implements IAttributesDictionaryUC {
  constructor( 
    private sftpProvider: ISftpProvider,
    public readonly _serviceError: IServiceErrorUc,
  ) { }

  private readonly logger = new Logging(AttributesDictionaryUC.name);

  /**
   * Operación que envía la información para crear el dataload
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @param {String} path Endpoint donde se almacenara el dataload
   */
  async dataLoadConfiguration(data: ECategory, pathAttributesDictionary: string, pathAttributesDictionaryB2b: string) {
    try {
      this.logger.write('dataLoadConfiguration() - AttributesDictionaryUC', Etask.CREATE_ATTRIBUTES_DICTIONARY);

      let jsonData = [];
      let HEADERS = [];
      let dataFinal = [];
   
      for (const category of Object.values(ECategoriesDataload)) {

        this.logger.write(`dataLoadConfiguration() | ${category}`, Etask.CREATE_ATTRIBUTES_DICTIONARY);
        
        dataFinal = dataFinal.concat(data[category]);
        
        if(category === 'Hogares'){
          
          let dataJson = await this.generateRows(dataFinal);
          const TITLE_COLORS = await this.getTitles(dataFinal);
          jsonData = jsonData.concat(dataJson);
          
          const  STREAMHEADERS = [
            { id: 'Identifier', title: 'Identifier' },
            { id: 'Type', title: 'Type' },
            { id: 'AttributeType', title: 'AttributeType' },
            { id: 'Sequence', title: 'Sequence' },
            { id: 'Displayable', title: 'Displayable' },
            { id: 'Comparable', title: 'Comparable' },
            { id: 'Facetable', title: 'Facetable' },
            { id: 'Searchable', title: 'Searchable' },
            { id: 'Name', title: 'Name' },
            ...TITLE_COLORS,
            { id: 'Delete', title: 'Delete' }
          ]
  
          HEADERS = HEADERS.concat(STREAMHEADERS);
        }
        
      }
   
      let dataSinDuplicados = generalUtil.removeDuplicates(jsonData, "Identifier");

      const CSV_ROOT_FILE = find.getCsv(generalConfig.attributesDictionary);
      await CreateCsv.createCsv(dataSinDuplicados, CSV_ROOT_FILE, HEADERS, 'AttributeDictionaryAttributeAllowedValues', 'attribute_dictionary_0');
      await CreateCsv.unificateFiles('attribute_dictionary_0', CSV_ROOT_FILE);

      await this.sftpProvider.update(CSV_ROOT_FILE, pathAttributesDictionary);
    } catch (error) {
      this.logger.write(`dataLoadConfiguration() | ${ETaskDesc.ERROR_GENERATE_DATALOAD}`, Etask.CREATE_ATTRIBUTES_DICTIONARY);
      
    }
  }

  /**
   * Operación para crear las filas del csv
   * @param {ICatalog[]} data Productos con sus caracteristicas
   * @returns {IAttributesDictionary[]} Arreglo con las filas para el archivo csv
   */
  private async generateRows(data: ICatalog[]): Promise<IAttributesDictionary[]>{
    try {
      let rows: IAttributesDictionary[] = [];
      const FEATURES = await this.filerFeatures(data);
      const COLORS = await this.filterColors(data);

      for (const feature of FEATURES) {
        let row: IAttributesDictionary = {
          Identifier: feature.id,
          Type: 'STRING',
          Sequence: '1',
          Displayable: 'false',
          Comparable: 'false',
          Facetable: 'false',
          Searchable: 'false',
          Name: feature.name,
          Delete: ''
        }
        
        if (feature.id == 'Color'){
          COLORS.forEach(color => row[color.id] = color.value);
          row.AttributeType = "AllowedValues";
        }else{
          row.AttributeType = 'AssignedValues';
        }

        rows.push(row);
      }

      return rows.filter(row => row.Identifier != 'specificationSubtype');
    } catch (error) {
      this.logger.write(`generateRows() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_ATTRIBUTES_DICTIONARY);
      
    }
  }

  /**
   * Operación para obtener las caracteristicas sin repetir
   * @param {ICatalog[]} data Arreglo con los productos
   * @returns {Object} Arreglo con las caracteristicas sin repetir
   */
  private async filerFeatures(data: ICatalog[]): Promise<any>{
    try {
      let allFeatures: IFeatures[] = [];

      data.forEach(product => allFeatures.push(...product.features));

      const removeDuplicates = (features: any) => {
        const UNIC_FEATURES = features.map(feature => {
          return [feature.id, feature];
        })

        return [...new Map(UNIC_FEATURES).values()];
      }

      return removeDuplicates(allFeatures);
    } catch (error) {
      this.logger.write(`filerFeatures() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_ATTRIBUTES_DICTIONARY);
      
    }
  }

  /**
   * Operación para obtener los colores sin repetir
   * @param {ICatalog[]} data Arreglo con los productos
   * @returns {Object} Arreglo con los colores sin repetir
   */
  private async filterColors(data: ICatalog[]): Promise<any>{
    try {
      const HAS_COLOR = data.filter(product => product.features[product.features.findIndex(feature => feature.id == "Color")]);
      let columnsColor = [];

      if (HAS_COLOR && HAS_COLOR.length > 0){
        const COLORS = [...new Set(HAS_COLOR.map(product => product.features[product.features.findIndex(feature => feature.id == "Color")].value))];
    
        for (let i = 0; i < COLORS.length; i++) {
          columnsColor.push({id: `AllowedValue${i+1}`, value: COLORS[i]});
        }
      }

      return columnsColor;
    } catch (error) {
      this.logger.write(`filterColors() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_ATTRIBUTES_DICTIONARY);
      
    }
  }

  /**
   * Operación para obtener los titulos para los colores
   * @param {ICatalog[]} data Arreglo con los productos
   * @returns {Object} Arreglo con los titulos de los colores
   */
  private async getTitles(data: ICatalog[]): Promise<any>{
    try {
      const HAS_COLOR = data.filter(product => product.features[product.features.findIndex(feature => feature.id == "Color")]);

      let titles = [];

      if (HAS_COLOR && HAS_COLOR.length > 0){
        const COLORS = [...new Set(HAS_COLOR.map(product => product.features[product.features.findIndex(feature => feature.id == "Color")].value))];

        for (let i = 0; i < COLORS.length; i++) {
          titles.push({id: `AllowedValue${i+1}`, title: `AllowedValue${i+1}`});
        }
      }

      return titles;
    } catch (error) {
      this.logger.write(`getTitles() | ${ETaskDesc.ERROR_GENERATE_ROWS}`, Etask.CREATE_ATTRIBUTES_DICTIONARY);
      
    }
  }

}