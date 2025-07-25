/**
 * Clase que se implementa para ejecucion del Job
 * @author Juan David Marin
 */
import { Injectable } from '@nestjs/common';
import { ResponseService } from '../../../controller/dto/response-service.dto';
import { IJobService } from '../get-state-homepass.service';
import { IHomePassRetryUc } from '../../../core/use-case/homepass-retry.uc';
import Logging from 'src/common/lib/logging';
import { ETaskDesc, Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import GeneralUtil from 'src/common/utils/generalUtil';

@Injectable()
export class JobService implements IJobService {
  private readonly logger = new Logging(JobService.name);
  constructor(private readonly _homePassRetry: IHomePassRetryUc) {}

  /**
   * Firma del metodo para ejecutar el Job
   * @returns una promesa
   */
  async execJob(): Promise<ResponseService<any>> {
    this.logger.write('execJob()', Etask.JOB_EXECUTION, ELevelsErrors.INFO);
    try {
      await this._homePassRetry.getStateHomePass();
      return new ResponseService(true, 'Job ejecutado correctamente', 200, true);
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.JOB_EXECUTION, ETaskDesc.JOB_EXECUTION);
      throw error;
    }
  }
}
