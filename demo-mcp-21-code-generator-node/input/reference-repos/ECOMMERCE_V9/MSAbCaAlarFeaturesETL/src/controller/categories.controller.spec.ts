import { Test } from '@nestjs/testing';
import { responseDummy } from "../../test/response-dummy";
import { CategoriesController } from "./categories.controller";
import { ICategoriesService } from "./service/categories.service";
import { IServiceTracingUc } from "../core/use-case/resource/service-tracing.resource.uc";

describe('CategoriesController', () => {
  let categoriesController: CategoriesController;
  let mockCategoriesService: ICategoriesService;
  let mockServiceTracing: IServiceTracingUc;

  beforeEach(async () => {
    mockCategoriesService = {
      updateFeatures: jest.fn().mockReturnValue(responseDummy),
      jobUpdateFeatures: jest.fn().mockReturnValue(responseDummy)
    };

    mockServiceTracing = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    const module = await Test.createTestingModule({
      controllers: [CategoriesController],
      providers: [
        { provide: ICategoriesService, useValue: mockCategoriesService },
        { provide: IServiceTracingUc, useValue: mockServiceTracing }
      ]
    }).compile();
    categoriesController = module.get<CategoriesController>(CategoriesController);
  });

  describe('updateFeatures', () => {
    it('should updateFeatures', async () => {
      const result = await categoriesController.updateFeatures();
      expect(mockCategoriesService.updateFeatures).toHaveBeenCalledWith();
      expect(result.status).toBe(200);
    });
  });
});