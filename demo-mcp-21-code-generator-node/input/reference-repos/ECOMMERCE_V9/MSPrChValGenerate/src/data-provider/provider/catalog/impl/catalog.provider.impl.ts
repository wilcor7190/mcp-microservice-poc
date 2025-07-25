/**
 * clase que guarda o elmimina de la bd de catalog
 * * @author Daniel C Rubiano R
 */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductAttributesModel } from 'src/data-provider/model/catalog/product-attributes/product-attributes.model';
import { ICatalogProvider } from '../catalog.provider';
import { ExceptionModel } from 'src/data-provider/model/catalog/exception.model';
import { TermsModel } from 'src/data-provider/model/catalog/terms.model';
import { FamilyParams } from 'src/common/utils/enums/params.enum';
import databaseConfig from "src/common/configuration/database.config";
import { Etask } from 'src/common/utils/enums/taks.enum';
import * as APM from '@claro/general-utils-library';
import { MappingApiRest } from 'src/common/utils/enums/tracing.enum';
import { CollectionsNames } from 'src/common/utils/enums/collectionsNames.enum';
import Logging from "src/common/lib/logging";



export class CatalogProvider implements ICatalogProvider {
  constructor(
    @InjectModel(ProductAttributesModel.name, databaseConfig.databaseCatalog) private readonly productAttributesModel: Model<ProductAttributesModel>,
    @InjectModel(ExceptionModel.name, databaseConfig.databaseCatalog) private readonly exceptionModel: Model<ExceptionModel>,
    @InjectModel(TermsModel.name, databaseConfig.databaseCatalog) private readonly termcondModel: Model<TermsModel>,
  ) { }
  private readonly logger = new Logging(CatalogProvider.name);



  async saveExceptionSkus(content: any): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(ExceptionModel.name, MappingApiRest.DB, 'saveExceptionSkus', Etask.APM);
      return this.exceptionModel.insertMany(content);
    } finally {
      if (spanIn) spanIn.end();
    }

  }

  async deleteExceptionSkus(): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(ExceptionModel.name, MappingApiRest.DB, 'deleteExceptionSkus', Etask.APM);
      return this.exceptionModel.deleteMany({});
    } finally {
      if (spanIn) spanIn.end();
    }

  }

  async saveTermsConditions(content: any): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(TermsModel.name, MappingApiRest.DB, 'saveTermsConditions', Etask.APM);
      return this.termcondModel.insertMany(content);
    } finally {
      if (spanIn) spanIn.end();
    }

  }

  async getAllTermsConditions(): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(TermsModel.name, MappingApiRest.DB, 'saveTermsConditions', Etask.APM);
      return this.termcondModel.find().lean();
    } finally {
      if (spanIn) spanIn.end();
    }
  }

  async deleteTermsConditions(): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(TermsModel.name, MappingApiRest.DB, 'deleteTermsConditions', Etask.APM);
      return this.termcondModel.deleteMany({});
    } finally {
      if (spanIn) spanIn.end();
    }

  }

  /**
   * Funcion para el cruce de las COLPRTATTRIBUTES y COLPRTEXCEPTIONS
   * @returns Objeto con los PO_EQU que se deben excluir
   */
  async getDataSkuException(categoria: FamilyParams): Promise<any> {
    let spanIn: any;
    try {
      let regex: any;
      regex = await this.getCategoria(categoria)
      let aggregate = this.getAgreggate(regex, CollectionsNames.EXCEPTION_SKU, 'SKU')

      spanIn = APM.startSpan(ProductAttributesModel.name, MappingApiRest.DB, 'getDataSkuException', Etask.APM);
      return this.productAttributesModel.aggregate(aggregate);
    } finally {
      if (spanIn) spanIn.end();
    }

  }

  async saveAttributes(content: any): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(ProductAttributesModel.name, MappingApiRest.DB, 'saveAttributes', Etask.APM);
      return this.productAttributesModel.insertMany(content);
    } finally {
      if (spanIn) spanIn.end();
    }

  }

  async deleteAttributes(): Promise<any> {
    let spanIn: any;
    try {
      spanIn = APM.startSpan(ProductAttributesModel.name, MappingApiRest.DB, 'deleteAttributes', Etask.APM);
      return this.productAttributesModel.deleteMany({});
    } finally {
      if (spanIn) spanIn.end();
    }

  }

  /**
   * Cruce entre caracteristicas y disponibilidad para hallar el stock de cada PO
   * @param {*}categoria se utilizara el campo consulta para agregar si es PO_EQU o PO_TEC
   * @returns COLPRTATTRIBUTES objeto con el cruce de la tabla de disponibilidad COLPRTDISPONIBILITY_FILE
   */
  async getDataAttributes(categoria: FamilyParams): Promise<any> {
    let spanIn: any;
    try {
      let regex: any;
      regex = await this.getCategoria(categoria)

      let aggregate = this.getAgreggate(regex)

      spanIn = APM.startSpan(ProductAttributesModel.name, MappingApiRest.DB, 'getDataAttributes', Etask.APM);
      
      return this.productAttributesModel.aggregate(aggregate);
    } finally { 
      if (spanIn) spanIn.end();
    }

  }

  private getCategoria(categoria: FamilyParams) {
    let regex: any;
    if (categoria === FamilyParams.equipment) {
      regex = /^PO_Equ/;
    }
    if (categoria === FamilyParams.technology) {
      regex = /^PO_Tec/;
    }
    return regex
  }

  private getAgreggate(regex: any, colleccion?: string, foreignField?: string) {
    let lookup;
    if (colleccion == CollectionsNames.EXCEPTION_SKU) {
      lookup = {
        $lookup: {
          from: colleccion,
          localField: 'filter',
          foreignField: foreignField,
          as: 'relacion',
        },
      }

    } else {
      lookup = {
        $match: {
          relacion: {
            $ne: [],
          },
        },
      }
    }

    return [
      {
        $match: {
          id: { $regex: regex },
        },
      },
      {
        //agregar projection
        $addFields: {
          filter: {
            //hace un substring de la cadena PO_EQU o PO_Tec   para traer solo el pin
            $substr: ['$id', 6, -1],
          },
        },
      },
      lookup,
      {
        $match: {
          relacion: {
            $ne: [],
          },
        },
      },
      {
        $project: {
          id: 1,
          filter: 1,
          'versions.specificationType': 1,
          'versions.characteristics.id': 1,
          'versions.characteristics.versions.id': 1,
          'versions.characteristics.versions.value': 1,
          'versions.name': 1,
          'versions.description': 1,
          'versions.id': 1,
        },
      },
    ];
  }

}
