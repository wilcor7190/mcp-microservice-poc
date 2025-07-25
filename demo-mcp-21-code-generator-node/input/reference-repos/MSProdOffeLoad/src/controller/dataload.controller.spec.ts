import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { IServiceTracingUc } from "../core/use-case/resource/service-tracing.resource.uc";
import { responseDummy } from "../../test/response-dummy";
import { DataloadController } from "./dataload.controller";
import { IDataloadService } from "./service/dataload.service";


describe('PriceController', () => {
  let controller: DataloadController;
  let mockOffeloadService: jest.Mocked<IDataloadService>;
  let mockServiceTracing: jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {
    mockOffeloadService = {
      // Mock the methods from IPricesService used by the implementation
      generateDataloadManual: jest.fn(),
    } as jest.Mocked<IDataloadService>;

    mockServiceTracing = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DataloadController],
      providers: [
        { provide: IDataloadService, useValue: mockOffeloadService },
        { provide: IServiceTracingUc, useValue: mockServiceTracing },
      ],
    }).compile();

    controller = module.get<DataloadController>(DataloadController);
  });

  describe('getPricesManual', () => {
    it('should trigger pricesProcess and create service tracing on success', async () => {
      mockOffeloadService.generateDataloadManual.mockResolvedValue({
        success: true,
        status: HttpStatus.OK,
        message: 'OK',
        documents: responseDummy,
      });

      const req = {
        "dataload": "Product-Data"
      };

      const result = await controller.generateDataloadManual(req);

      expect(mockOffeloadService.generateDataloadManual).toHaveBeenCalled();
      expect(result.status).toBe(HttpStatus.OK);
      expect(result.documents).toEqual(responseDummy);
    });
  });
});