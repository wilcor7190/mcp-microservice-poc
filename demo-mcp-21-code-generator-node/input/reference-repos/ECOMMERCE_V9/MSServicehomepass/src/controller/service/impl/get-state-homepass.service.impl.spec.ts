import { Test, TestingModule } from "@nestjs/testing";
import { IGlobalValidateService } from "../resources/globalValidate.service";
import { IHomePassRetryUc } from "../../../core/use-case/homepass-retry.uc";
import { JobService } from "./get-state-homepass.service.impl";


const mockHomePassRetryUc = {
  getStateHomePass: jest.fn()
}

const mockGlobalValidateService = {
    validateChannel: jest.fn()
}

describe('AddressComplement', () => {
    let service: JobService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
              JobService,
                { provide: IHomePassRetryUc, useValue: mockHomePassRetryUc },
                { provide: IGlobalValidateService, useValue: mockGlobalValidateService }
            ]
        }).compile();

        service = module.get<JobService>(JobService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
      
    describe('getStateHomePass', () => {
        it('should return success', async () => {
          mockHomePassRetryUc.getStateHomePass.mockResolvedValue({});
            const result = await service.execJob();
            expect(result).toBeDefined();
        })
    })
})