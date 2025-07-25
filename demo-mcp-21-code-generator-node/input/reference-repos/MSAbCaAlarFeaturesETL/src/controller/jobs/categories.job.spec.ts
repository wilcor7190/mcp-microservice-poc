import { ICategoriesService } from '../service/categories.service';
import { IServiceTracingUc } from '../../core/use-case/resource/service-tracing.resource.uc';
import { ETaskDesc, ETaskTrace, Etask } from '../../common/utils/enums/taks.enum';
import { CategoriesJob } from './categories.job';
import generalConfig from "../../common/configuration/general.config";


describe('CategoriesJob', () => {
  let categoriesJob: CategoriesJob;
  let mockICategoriesService: jest.Mocked<ICategoriesService>;
  let mockServiceTracing: jest.Mocked<IServiceTracingUc>;

  beforeEach(() => {
    mockICategoriesService = {
      updateFeatures: jest.fn(),
      jobUpdateFeatures: jest.fn(),
    } as jest.Mocked<ICategoriesService>;

    mockServiceTracing = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    categoriesJob = new CategoriesJob(mockICategoriesService, mockServiceTracing);
  });

  describe('getData', () => {
    it('should execute updateFeatures and create service tracing on success', async () => {
        mockICategoriesService.updateFeatures.mockResolvedValue({
        success: true,
        status: 200,
        message: "OK"
      });

      await categoriesJob.featuresJob();

      expect(mockServiceTracing.createServiceTracing).toHaveBeenCalledWith({
        status: ETaskTrace.SUCCESS,
        origin: "V1/Categories/manual",
        description: Etask.EXEC_CRON_CATEGORIES,
        task: ETaskDesc.START_FEATURES_UPDATE_JOB,
      });

      expect(mockICategoriesService.jobUpdateFeatures).toHaveBeenCalled();
    });
  });
});
