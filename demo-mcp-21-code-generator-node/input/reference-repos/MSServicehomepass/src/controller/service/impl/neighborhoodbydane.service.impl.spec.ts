import { Test, TestingModule } from "@nestjs/testing";
import { IGlobalValidateService } from "../resources/globalValidate.service";
import { Neighborhoodbydane } from "./neighborhoodbydane.service.impl";
import { INeighborhoodbydaneUc } from "../../../core/use-case/procedures/neighborhoodbydane.uc";


const mockNeighborhoodbydaneUc = {
  neighborhoodbydane: jest.fn()
}

const mockGlobalValidateService = {
    validateChannel: jest.fn()
}

describe('AddressComplement', () => {
    let service: Neighborhoodbydane;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
              Neighborhoodbydane,
                { provide: INeighborhoodbydaneUc, useValue: mockNeighborhoodbydaneUc },
                { provide: IGlobalValidateService, useValue: mockGlobalValidateService }
            ]
        }).compile();

        service = module.get<Neighborhoodbydane>(Neighborhoodbydane);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
      
    describe('getStateHomePass', () => {
        it('should return success', async () => {
          mockNeighborhoodbydaneUc.neighborhoodbydane.mockResolvedValue({});
            const result = await service.consultNeighborhoodbydane("EC9_B2C", "", {daneCode:"", addressType: ""});
            expect(result).toBeDefined();
        })

        it('should return success', async () => {
          mockNeighborhoodbydaneUc.neighborhoodbydane.mockResolvedValue(new Error());
            const result = await service.consultNeighborhoodbydane("EC9_B2C", "", {daneCode:"", addressType: ""});
            expect(result).toBeDefined();
        })
    })
})