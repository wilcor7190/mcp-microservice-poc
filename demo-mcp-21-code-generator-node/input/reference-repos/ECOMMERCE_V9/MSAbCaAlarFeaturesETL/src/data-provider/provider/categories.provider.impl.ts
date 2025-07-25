import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ICategoriesProvider } from '../categories.provider';
import { EquipmentModel } from '../model/categories/equipment.model';
import { HomeModel } from '../model/categories/home.model';
import { PospagoModel } from '../model/categories/pospago.model';
import { PrepagoModel } from '../model/categories/prepago.model';
import { TechnologyModel } from '../model/categories/technology.model';
import { ContingencyModel } from '../model/contingency.model';
import { IMappingFeature } from '../../core/entity/categories/category.entity';
import Logging from '../../common/lib/logging';
import { Etask,ETaskDesc } from '../../common/utils/enums/taks.enum';
import { IFilterCategorie } from '../../core/entity/categories/filter-category.entity';
import { ICatalog } from '../../core/entity/catalog.entity';
import { ITaskError } from '../../core/entity/service-error/task-error.entity';
import { IServiceErrorUc } from '../../core/use-case/resource/service-error.resource.uc';
import databaseConfig from '../../common/configuration/database.config';
import { MappingApiRest } from '../../common/utils/enums/mapping-api-rest';
import * as APM from '@claro/general-utils-library';

/**
 * Clase encargada de realizar las operación con la base de datos
 * @author Santiago Vargas
 */
@Injectable()
export class CategoriesProviderImpl implements ICategoriesProvider {

  constructor(
    @InjectModel(ContingencyModel.name, databaseConfig.dbContingency) private readonly contingencyModel: Model<ContingencyModel>,
    @InjectModel(EquipmentModel.name, databaseConfig.dbFeatures) private readonly equipmentModel: Model<EquipmentModel>,
    @InjectModel(TechnologyModel.name, databaseConfig.dbFeatures) private readonly technologyModel: Model<TechnologyModel>,
    @InjectModel(PospagoModel.name, databaseConfig.dbFeatures) private readonly pospagoModel: Model<PospagoModel>,
    @InjectModel(PrepagoModel.name, databaseConfig.dbFeatures) private readonly prepagoModel: Model<PrepagoModel>,
    @InjectModel(HomeModel.name, databaseConfig.dbFeatures) private readonly homeModel: Model<HomeModel>,
    public readonly _serviceError: IServiceErrorUc
  ) { }

  private readonly logger = new Logging(CategoriesProviderImpl.name);
  private modelMap: Record<string, Model<any>> = {
    Terminales: this.equipmentModel,
    Tecnologia: this.technologyModel
  }
  
  /**
   * Operación para consultar las caracteriscticas
   * @param {IFilterCategorie} filter Parametros para el filtro 
   * @returns {Object} Arreglo con caracteristicas
   */
  async getContingency(filter: IFilterCategorie): Promise<any> {
    let spanIn: any;
    try{
      const START_TIME = process.hrtime();
      spanIn = APM.startSpan(ContingencyModel.name, MappingApiRest.DB,'getContingency',Etask.APM);
      const DATA = this.contingencyModel.find({
        "params.family": filter.family,
        "params.type": filter.type
      }).lean();
      this.createLog(filter, START_TIME, Etask.FIND_CONTINGENCY);
      return DATA;
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operación para actualizar las caracteristicas
   * @param {Object} data Nuevas caracteristicas para guardar
   * @param {String} family Categoría para el flujo en el que se guardaran las caracteristicas
   * @returns {Boolean} Confirmación de inserción de información 
   */
  async updateFeatures(data: IMappingFeature[], family: string): Promise<any> {
    let spanIn: any;
    try{
      switch (family) {
        case "Terminales":
          spanIn = APM.startSpan(EquipmentModel.name, MappingApiRest.DB,'updateFeatures',Etask.APM);       
          return this.equipmentModel.insertMany(data);
  
        case "Tecnologia":
          spanIn = APM.startSpan(TechnologyModel.name, MappingApiRest.DB,'updateFeatures',Etask.APM);
          return this.technologyModel.insertMany(data);
  
        case "Prepago":
          spanIn = APM.startSpan(PrepagoModel.name, MappingApiRest.DB,'updateFeatures',Etask.APM);
          return this.prepagoModel.insertMany(data);
  
        case "Pospago":
          spanIn = APM.startSpan(PospagoModel.name, MappingApiRest.DB,'updateFeatures',Etask.APM);
          return this.pospagoModel.insertMany(data);
  
        case "Hogares":
          spanIn = APM.startSpan(HomeModel.name, MappingApiRest.DB,'updateFeatures',Etask.APM);
          return this.homeModel.insertMany(data);
      }
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operacion para limpiar o borrar las colecciones
   * @param {String} family Categoría para el flujo del que se borraran las caracteristicas
   * @returns {Boolean} Confirmación de la eliminación
   */
  async deleteCollections(family: string): Promise<any> {
    let spanIn: any;
    try{
      const START_TIME = process.hrtime();
      switch (family) {
        case "Terminales":
          spanIn = APM.startSpan(EquipmentModel.name, MappingApiRest.DB,'deleteCollections',Etask.APM);
          const DATA_EQUIPMENT = this.equipmentModel.deleteMany();
          this.createLog({ family }, START_TIME, Etask.DELETE_FEATURES);
          return DATA_EQUIPMENT;

        case "Tecnologia":
          spanIn = APM.startSpan(TechnologyModel.name, MappingApiRest.DB,'deleteCollections',Etask.APM);
          const DATA_TECHNOLOGY = this.technologyModel.deleteMany();
          this.createLog({ family }, START_TIME, Etask.DELETE_FEATURES);
          return DATA_TECHNOLOGY;

        case "Prepago":
          spanIn = APM.startSpan(PrepagoModel.name, MappingApiRest.DB,'deleteCollections',Etask.APM);
          const DATA_PREPAGO = this.prepagoModel.deleteMany();
          this.createLog({ family }, START_TIME, Etask.DELETE_FEATURES);
          return DATA_PREPAGO;

        case "Pospago":
          spanIn = APM.startSpan(PospagoModel.name, MappingApiRest.DB,'deleteCollections',Etask.APM);
          const DATA_POSPAGO = this.pospagoModel.deleteMany();
          this.createLog({ family }, START_TIME, Etask.DELETE_FEATURES);
          return DATA_POSPAGO;

        case "Hogares":
          spanIn = APM.startSpan(HomeModel.name, MappingApiRest.DB,'saveListParents',Etask.APM);
          const DATA_HOGARES = this.homeModel.deleteMany();
          this.createLog({ family }, START_TIME, Etask.DELETE_FEATURES);
          return DATA_HOGARES;
    }
    }finally{
      if(spanIn) spanIn.end();
    }
  }

  /**
   * Operacion para consultar las colecciones
   * @param {String} family Categoría para el flujo del que se consultan las caracteristicas
   * @returns 
   */
  async findCollections(family: string): Promise<ICatalog[]> {
    let spanIn: any;
    try {
      const START_TIME = process.hrtime();
      switch (family) {
        case "Terminales":
          spanIn = APM.startSpan(EquipmentModel.name, MappingApiRest.DB,'findCollections',Etask.APM);
          const DATA_EQUIPMENT = this.equipmentModel.find();
          this.createLog({ family }, START_TIME, Etask.FIND_DATA);
          return DATA_EQUIPMENT;
          
        case "Tecnologia":
          spanIn = APM.startSpan(TechnologyModel.name, MappingApiRest.DB,'findCollections',Etask.APM);
          const DATA_TECHNOLOGY = this.technologyModel.find();
          this.createLog({ family }, START_TIME, Etask.FIND_DATA);
          return DATA_TECHNOLOGY;
      }
    } catch (error) {
      this.logger.write(`findCollections() | ${ETaskDesc.ERROR_FIND_DATA}`, Etask.FIND_DATA);
      let task: ITaskError = {
        name: Etask.CREATE,
        description: ETaskDesc.ERROR_FIND_DATA
      }
      await this._serviceError.createServiceError(error, task);  

    }finally{
      if(spanIn) spanIn.end();
    }
  }



  /**
   * Operación para crear log
   * @param {Object} request 
   * @param startTime 
   * @param {Etask} task Tarea realizada
   */
  async createLog(request: any, startTime: any, task: Etask) {
    // Calcular el tiempo transcurrido
    const endTime = process.hrtime(startTime);
    const executionTime = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
    this.logger.write(`Consultando información - tiempo de ejecución createLog()`, task, false, request, '', executionTime);
  }

  /**
   * Operación para consultar las colecciones
   * @param {String} family Categoría para el flujo del que se consultan las caracteristicas
   * @returns {Model<any>} Modelo de la colección
   */
  private getModelByFamily(family: string): Model<any> {
    return this.modelMap[family];
  }

  /**
   * Operación para actualizar las características regulatorias
   * @param {String} family Categoría para el flujo del que se consultan las caracteristicas
   */
  async updateRegulatoryFeatures(family: string): Promise<void> {
    try {
      const model = this.getModelByFamily(family);
      const collectionName = model.collection.name
      const START_TIME = process.hrtime();
      this.logger.write(`Actualizando características regulatorias`, Etask.UPDATE_REGULATORY_FEATURES, false, { family })

      const pageSize = 1000
      let lastId = null
      let hasMore = true
      while (hasMore) {
        const docs = await model.find(lastId ? { id: { $gt: lastId } } : {}) 
          .sort({ id: 1 })
          .limit(pageSize)
          .select({ id: 1 })
          .lean()
          .exec()

        if (docs.length === 0) {
          break
        }

        lastId = docs[docs.length - 1].id
        const ids = docs.map(doc => doc.id)

        await model.aggregate([
          { $match: { id: { $in: ids } } },
          { $sort: { id: 1 } },
          {
            $lookup: {
              from: "coll_params",
              pipeline: [
                { $match: { id_param: "caracteristicas_regulatorias" } },
                { $project: { values: 1 } }
              ],
              as: "regulatoryFeatures"
            }
          },
          {
            $set: {
              regulatoryFeatures: { $arrayElemAt: ["$regulatoryFeatures", 0] }
            }
          },
          {
            $set: {
              regulatoryFeatures: "$regulatoryFeatures.values"
            }
          },
          {
            $set: {
              features: {
                $map: {
                  input: "$features",
                  as: "feat",
                  in: {
                    $let: {
                      vars: {
                        mappingDoc: {
                          $arrayElemAt: [
                            {
                              $filter: {
                                input: "$regulatoryFeatures",
                                as: "m",
                                cond: { $eq: ["$$m.name", "$$feat.id"] }
                              }
                            },
                            0
                          ]
                        },
                        codes: { $split: ["$$feat.value", ";"] }
                      },
                      in: {
                        $cond: [
                          {
                            $and: [
                              { $ne: ["$$mappingDoc", null] },
                              { $eq: ["$$mappingDoc.status", true] }
                            ]
                          },
                          {
                            $mergeObjects: [
                              "$$feat",
                              {
                                value: {
                                  $reduce: {
                                    input: "$$codes",
                                    initialValue: "",
                                    in: {
                                      $cond: [
                                        { $eq: ["$$value", ""] },
                                        {
                                          $let: {
                                            vars: {
                                              opt: {
                                                $arrayElemAt: [
                                                  {
                                                    $filter: {
                                                      input: "$$mappingDoc.options",
                                                      as: "o",
                                                      cond: { $eq: ["$$o.code", "$$this"] }
                                                    }
                                                  },
                                                  0
                                                ]
                                              }
                                            },
                                            in: { $ifNull: ["$$opt.description", "$$this"] }
                                          }
                                        },
                                        {
                                          $concat: [
                                            "$$value",
                                            "-",
                                            {
                                              $let: {
                                                vars: {
                                                  opt: {
                                                    $arrayElemAt: [
                                                      {
                                                        $filter: {
                                                          input: "$$mappingDoc.options",
                                                          as: "o",
                                                          cond: { $eq: ["$$o.code", "$$this"] }
                                                        }
                                                      },
                                                      0
                                                    ]
                                                  }
                                                },
                                                in: { $ifNull: ["$$opt.description", "$$this"] }
                                              }
                                            }
                                          ]
                                        }
                                      ]
                                    }
                                  }
                                }
                              }
                            ]
                          },
                          "$$feat"
                        ]
                      }
                    }
                  }
                }
              }
            }
          },
          { $unset: ["regulatoryFeatures"] },
          {
            $merge: {
              into: collectionName,
              whenMatched: "replace",
              whenNotMatched: "fail"
            }
          }
        ]).exec()
      }

      const endTime = process.hrtime(START_TIME);
      const executionTime = Math.round((endTime[0] * 1000) + (endTime[1] / 1000000));
      this.logger.write(`Características regulatorias actualizadas`, Etask.UPDATE_REGULATORY_FEATURES, false, { family }, '', executionTime)
    } catch (error) {
      throw new Error(`Error actualizando características regulatorias - ${family}: ${error.message}`);
    }
  }
}