/**
 * clase abstracta donde se manipulan ficheros para las colecciones de moviles y hogares
 * * @author oscar Robayo
 */
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IMobilePricesAttributesProvider } from 'src/data-provider/provider/mobile/mobile-prices-attributes.provider';
import { GeneralModel } from 'src/data-provider/model/general/general.model';
import Logging from 'src/common/lib/logging';
import { Etask } from 'src/common/utils/enums/taks.enum';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import databaseConfig from 'src/common/configuration/database.config';
import DbConnection from 'src/common/utils/dbConnection';
import { CollectionsNames } from 'src/common/utils/enums/collectionsNames.enum';

export class MobilePricesAttributesProvider
  implements IMobilePricesAttributesProvider
{
  constructor(
    @InjectModel(GeneralModel.name, databaseConfig.database)
    private readonly generalModel: Model<GeneralModel>,
  ) {}

  private readonly logger = new Logging(MobilePricesAttributesProvider.name);

  async saveDataMobileGeneralPrices(general: any): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      this.createLog(
        'Guardando datos de general prices',
        START_TIME,
        Etask.SAVE_DATAMOBILEGENERALPRICES,
      );
      await this.generalModel.insertMany(general);
    } catch (error) {
      this.logger.write(
        ' Finish saveDataMobileGeneralPrices()' + error,
        Etask.ERROR_SAVE_DATAMOBILEGENERALPRICES,
        ELevelsErros.ERROR,
      );
    }
  }

  async saveDataMobileGeneralAttributes(general: any): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      this.createLog(
        'Guardando datos de general attributes',
        START_TIME,
        Etask.SAVE_DATAMOBILEGENERALATTRIBUTES,
      );
      await this.generalModel.insertMany(general);
    } catch (error) {
      this.logger.write(
        ' Finish saveDataMobileGeneralAttributes()' + error,
        Etask.ERROR_SAVE_DATAMOBILEGENERALATTRIBUTES,
        ELevelsErros.ERROR,
      );
    }
  }

  async deleteDataMobileAttributes(): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      this.createLog(
        'Borrando datos de mobile attributes',
        START_TIME,
        Etask.DELETE_DATAMOBILEATTRIBUTES,
      );
      const db = await DbConnection.dbConnectionHomes();
      await db.collection(CollectionsNames.MOVILATTRIBUTES).deleteMany({});
    } catch (error) {
      this.logger.write(
        ' Finish deleteDataMobileAttributes()' + error,
        Etask.DELETE_DATAMOBILEATTRIBUTES,
        ELevelsErros.ERROR,
      );
    }
  }

  async deleteDataMobilePrices(): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      this.createLog(
        'Borrando datos de mobile prices',
        START_TIME,
        Etask.DELETE_DATAMOBILEPRICES,
      );
      const db = await DbConnection.dbConnectionHomes();
      await db.collection(CollectionsNames.MOVILPRICES).deleteMany({});
    } catch (error) {
      this.logger.write(
        ' Finish deleteDataMobilePrices()' + error,
        Etask.DELETE_DATAMOBILEPRICES,
        ELevelsErros.ERROR,
      );
    }
  }

  async saveDataTemporalCollectionMovil(
    nameCollection: string,
    content: any,
  ): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      this.createLog(
        'Guardando datos de temporal collection movil',
        START_TIME,
        Etask.SAVE_DATATEMPORALCOLLECTIONMOVIL,
      );
      const db = await DbConnection.dbConnectionHomes();
      await db.collection(nameCollection).insertMany(content);
    } catch (error) {
      this.logger.write(
        ' Finish saveDataTemporalCollectionMovil()' + error,
        Etask.SAVE_DATATEMPORALCOLLECTIONMOVIL,
        ELevelsErros.ERROR,
      );
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
    const executionTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
    this.logger.write(
      `Consultando información - tiempo de ejecución createLog()`,
      task,
      ELevelsErros.INFO,
      request,
      '',
      executionTime,
    );
  }
}
