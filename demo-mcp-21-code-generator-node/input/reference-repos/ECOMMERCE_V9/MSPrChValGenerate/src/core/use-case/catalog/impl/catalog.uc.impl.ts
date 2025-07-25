/**
 * Clase para construcción logica de negocio diferentes metodos de disponibilidad
 * @author Oscar Robayo
 */
import { Injectable } from '@nestjs/common';
import Logging from '../../../../common/lib/logging';
import utils from '../../../../common/utils/GeneralUtil';
import { ICatalogUc } from '../catalog.uc';
import { FamilyParams } from 'src/common/utils/enums/params.enum';
import { ICatalogProvider } from 'src/data-provider/provider/catalog/catalog.provider';
import {EDescriptionTracingGeneral,ETaskDesc,Etask,} from 'src/common/utils/enums/taks.enum';
import { ELevelsErros } from 'src/common/utils/enums/logging.enum';
import { IGetErrorTracingUc } from '../../resource/get-error-tracing.resource.uc';
import {EStatusTracingGeneral,ETaskTracingGeneral} from 'src/common/utils/enums/tracing.enum';

@Injectable()
export class CatalogUcImpl implements ICatalogUc {
  private readonly logger = new Logging(CatalogUcImpl.name);

  constructor(
    private readonly _catalogProvider: ICatalogProvider,
    public readonly _GetErrorTracing: IGetErrorTracingUc,
  ) {}


  async deleteAttributes(): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      await this._catalogProvider.deleteAttributes();
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write(
        'Borrando data COLPRTTTATTRIBUTES',
        Etask.DELETE_DATACOLPRTTTATTRIBUTES,
        ELevelsErros.INFO,
        '',
        processingTime,
      );
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        Etask.DELETE_DATACOLPRTTTATTRIBUTES,
        ETaskTracingGeneral.DELETE_DATA,
      );
      this.logger.write(
        'deleteAttributes()' + error.stack,
        Etask.DELETE_DATACOLPRTTTATTRIBUTES,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.DELETE_DATACOLPRTTTATTRIBUTES,
        ETaskDesc.DELETE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async saveAttributes(content: any): Promise<void> {
    try {
      await this._catalogProvider.saveAttributes(content);
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        Etask.SAVE_DATA_COLPRTTTATTRIBUTES,
        ETaskTracingGeneral.SAVE_DATA,
      );
      this.logger.write(
        'saveAttributes()' + error.stack,
        Etask.SAVE_DATA_COLPRTTTATTRIBUTES,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.SAVE_DATA_COLPRTTTATTRIBUTES,
        ETaskDesc.SAVE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async getDataAttributes(categoria: FamilyParams): Promise<any> {
    try {
      const START_TIME = process.hrtime();

      const DATA = await this._catalogProvider.getDataAttributes(categoria);

      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write(
        'Resultado ejecución BD',
        Etask.FIND_CARACTERISTICAS,
        ELevelsErros.INFO,
        { categoria },
        '',
        processingTime,
      );
 
      return DATA;
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.ERROR_FIND_CARACTERISTICAS,
        ETaskTracingGeneral.FIND_CARACTERISTICAS,
      );
      this.logger.write(
        'getDataDisponibility() ' + error.tasks,
        Etask.ERROR_FIND_CARACTERISTICAS,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.FIND_CARACTERISTICAS,
        ETaskDesc.FIND_CARACTERISTICAS,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async deleteExceptionSkus(): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      await this._catalogProvider.deleteExceptionSkus();
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write(
        'Borrando data COLPRTEXCEPTIONS',
        Etask.DELETE_DATA_COLPRTEXCEPTIONS,
        ELevelsErros.INFO,
        '',
        processingTime,
      );
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,Etask.DELETE_DATA_COLPRTEXCEPTIONS,ETaskTracingGeneral.DELETE_DATA,
      );
      this.logger.write(
        'deleteExceptionSkus()' + error.stack, Etask.DELETE_DATA_COLPRTEXCEPTIONS,ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,Etask.DELETE_DATA_COLPRTEXCEPTIONS,ETaskDesc.DELETE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async saveExceptionSkus(content: any): Promise<void> {
    try {
      
      this.logger.write(
      'Inicio Save data COLPRTEXCEPTIONS',
      Etask.SAVE_DATA_COLPRTEXCEPTIONS,
      ELevelsErros.INFO,
      '');
      const START_TIME = process.hrtime();
      await this._catalogProvider.saveExceptionSkus(content);
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write(
        'Fin Save data COLPRTEXCEPTIONS',
        Etask.SAVE_DATA_COLPRTEXCEPTIONS,
        ELevelsErros.INFO,
        '',
        processingTime,
      );
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        Etask.SAVE_DATA_COLPRTEXCEPTIONS,
        ETaskTracingGeneral.SAVE_DATA,
      );
      this.logger.write(
        'saveExceptionSkus()' + error.stack,
        Etask.SAVE_DATA_COLPRTEXCEPTIONS,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.SAVE_DATA_COLPRTEXCEPTIONS,
        ETaskDesc.SAVE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async deleteTermsConditions(): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      await this._catalogProvider.deleteTermsConditions();
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write('Borrando data COLPRTTERMS', Etask.DELETE_DATA_COLPRTTERMS, ELevelsErros.INFO,'', processingTime,);
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,Etask.DELETE_DATA_COLPRTTERMS,ETaskTracingGeneral.DELETE_DATA,
      );
      this.logger.write(
        'deleteExceptionSkus()' + error.stack, Etask.DELETE_DATA_COLPRTTERMS,ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,Etask.DELETE_DATA_COLPRTTERMS,ETaskDesc.DELETE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async getAllTermsConditions(): Promise<any> {
    try {
      const START_TIME = process.hrtime();
      const data = await this._catalogProvider.getAllTermsConditions();
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write('Consultando data COLPRTTERMS', Etask.GET_ALL_TERMS_CONDITIONS,ELevelsErros.INFO,'',processingTime,);
      return data
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,Etask.GET_ALL_TERMS_CONDITIONS,ETaskTracingGeneral.GET_ALL_TERMS_CONDITIONS,
      );
      this.logger.write(
        'saveExceptionSkus()' + error.stack, Etask.GET_ALL_TERMS_CONDITIONS, ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error, Etask.GET_ALL_TERMS_CONDITIONS, ETaskDesc.GET_ALL_TERMS_CONDITIONS,
      );
      await this._GetErrorTracing.getError(error);
    }  
  }

  async saveTermsConditions(content: any): Promise<void> {
    try {
      const START_TIME = process.hrtime();
      await this._catalogProvider.saveTermsConditions(content);
      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write('Save data COLPRTTERMS', Etask.SAVE_DATA_COLPRTTERMS,ELevelsErros.INFO,'',processingTime,);
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,Etask.SAVE_DATA_COLPRTTERMS,ETaskTracingGeneral.SAVE_DATA,
      );
      this.logger.write(
        'saveExceptionSkus()' + error.stack, Etask.SAVE_DATA_COLPRTTERMS, ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error, Etask.SAVE_DATA_COLPRTEXCEPTIONS, ETaskDesc.SAVE_DATA,
      );
      await this._GetErrorTracing.getError(error);
    }
  }

  async getDataSkuException(categoria: FamilyParams): Promise<any> {
    try {
      const START_TIME = process.hrtime();

      const DATA = await this._catalogProvider.getDataSkuException(categoria);

      const processingTime = this.processExecutionTime(START_TIME);
      this.logger.write(
        'getDataSkuException()',
        Etask.EXCEPTION_SKU,
        ELevelsErros.INFO,
        '',
        '',
        processingTime,
      );

      return DATA;
    } catch (error) {
      await this._GetErrorTracing.createTraceability(
        EStatusTracingGeneral.ERROR,
        EDescriptionTracingGeneral.ERROR_FIND_EXCEPCIONES,
        ETaskTracingGeneral.FIND_EXCEPCIONES,
      );
      this.logger.write(
        'getDataSkuException() ' + error.tasks,
        Etask.EXCEPTION_SKU,
        ELevelsErros.ERROR,
      );
      utils.assignTaskError(
        error,
        Etask.EXCEPTION_SKU,
        ETaskDesc.EXCEPTION_SKU,
      );
      await this._GetErrorTracing.getError(error);
    }
  }





  /**
   * Función para generar log informativo para el services provider de Message
   * @param {any} startTime cadena fecha inicio consulta bd
   */
  processExecutionTime(startTime: any): number {
    const endTime = process.hrtime(startTime);
    return Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
  }
}
