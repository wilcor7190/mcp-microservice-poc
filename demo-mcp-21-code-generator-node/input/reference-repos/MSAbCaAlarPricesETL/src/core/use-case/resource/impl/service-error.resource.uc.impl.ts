import { Injectable } from '@nestjs/common';
import { IServiceErrorProvider } from '../../../../data-provider/service-error.provider';
import { IServiceErrorUc } from '../service-error.resource.uc';
import { GlobalReqOrigin } from '../../../../common/configuration/general.config';
import GeneralUtil from '../../../../common/utils/generalUtil';
import Logging from '../../../../common/lib/logging';
import { ELevelsErros } from '../../../../common/utils/enums/logging.enum';
import { IServiceError, ITaskError } from '@claro/generic-models-library';

@Injectable()
export class ServiceErrorUcimpl implements IServiceErrorUc {
  constructor(private readonly _serviceErrorProvider: IServiceErrorProvider) {}
  private readonly logger = new Logging(ServiceErrorUcimpl.name);

  async createServiceError(error: any, task: ITaskError, level?: ELevelsErros) {
    this.logger.write(
      error.message,
      task,
      ELevelsErros.ERROR,
      GlobalReqOrigin.request,
    );

    const dataError: IServiceError = {
      origin: GlobalReqOrigin.globalOrigin,
      message: error.message,
      stack: error.stack,
      request: GlobalReqOrigin.request,
      channel: GlobalReqOrigin.requestHeaders,
    };
    return this._serviceErrorProvider.createServiceError(dataError);
  }

  async getServiceErrors(filter: any): Promise<any> {
    let result = {
      success: false,
      message: '',
      documents: [],
    };
    const resultDate = GeneralUtil.validateDate(
      filter.startDate,
      filter.endDate,
    );
    if (resultDate === 1 || resultDate > 30) {
      result.message =
        'Error en fechas de consulta la fecha de inicio es mayor a la final o existen fechas de mas de 30 dias';
      return result;
    }

    const query = {
      createdAt: {
        $gte: new Date(filter.startDate.toISOString()),
        $lte: new Date(filter.endDate.toISOString()),
      },
    };

    const documents = await this._serviceErrorProvider.getServiceErrors(query);
    if (documents.length > 0) {
      result.success = true;
      result.message = 'Consulta ejecutada correctamente';
      result.documents = documents;
      return result;
    } else {
      result.message = 'No se encontraron resultados';
      return result;
    }
  }
}
