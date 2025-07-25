import { Injectable } from '@nestjs/common';
import { IJobService } from '../service/get-state-homepass.service';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import Logging from 'src/common/lib/logging';
import { ETaskDesc, Etask } from 'src/common/utils/enums/task.enum';
import { ELevelsErrors } from 'src/common/utils/enums/logging.enum';
import GeneralUtil from 'src/common/utils/generalUtil';

@Injectable()
export class TasksService {
  private readonly logger = new Logging(TasksService.name);

  constructor(
    private readonly _homePassRetry: IJobService,
    public readonly _serviceTracing: IServiceTracingUc,
  ) {}


  async handleCron() {
    this.logger.write('Inicio Ejecución CRON', Etask.JOB_EXECUTION, ELevelsErrors.INFO);
    this._serviceTracing.createServiceTracing(GeneralUtil.traceabilityForCronJob(Etask.JOB_EXECUTION));
    try {
      const startTime = process.hrtime();
      await this._homePassRetry.execJob();
      const endTime = process.hrtime(startTime);
      const executionTime = Math.round(endTime[0] * 1000 + endTime[1] / 1000000);
      this.logger.write('Fin Ejecución CRON', Etask.JOB_EXECUTION, ELevelsErrors.INFO);
      this._serviceTracing.createServiceTracing(GeneralUtil.traceabilityForCronJob(Etask.JOB_EXECUTION, executionTime));
    } catch (error) {
      GeneralUtil.assignTaskError(error, Etask.JOB_EXECUTION, ETaskDesc.JOB_EXECUTION);
      throw error;
    }
  }
}
