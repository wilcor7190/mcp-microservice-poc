import { Test, TestingModule } from "@nestjs/testing";
import { IGlobalValidateService } from "../resources/globalValidate.service";
import { PutClientHomepass } from "./putClientHomepass.service.impl";
import { EmessageMapping } from "../../../common/utils/enums/message.enum";
import { BodyExampleNotMigratedUser } from "../../../mockup/PutClientHomepass/responsePutClientHomepass.mock";
import { IOrchPutClientHomePassUc } from "../../../core/use-case/orchPutClienHomePass.uc";
import { LegacyException } from "../../../common/lib/legacy-exeptions";


const mockOrchPutClientHomepassUc = {
    initialFunction: jest.fn()
}


const mockGlobalValidateService = {
    validateChannel: jest.fn()
}

describe('AddressComplement', () => {
    let service: PutClientHomepass;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                PutClientHomepass,
                { provide: IOrchPutClientHomePassUc, useValue: mockOrchPutClientHomepassUc },
                { provide: IGlobalValidateService, useValue: mockGlobalValidateService }
            ]
        }).compile();

        service = module.get<PutClientHomepass>(PutClientHomepass);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
      
    describe('getStateHomePass', () => {
        it('should return success', async () => {
            try{
            mockOrchPutClientHomepassUc.initialFunction.mockResolvedValue({Response: EmessageMapping.LEGADO_ERROR});
            const result = await service.consultPutClientHomepass('EC9_B2C',BodyExampleNotMigratedUser);
            expect(result).toBeDefined();
            }catch(err){
                expect(err).toBeDefined();
            }
        })

        it('should return success', async () => {
            mockOrchPutClientHomepassUc.initialFunction.mockResolvedValue({Response: EmessageMapping.DEFAULT});
            const result = await service.consultPutClientHomepass('EC9_B2C',BodyExampleNotMigratedUser);
            expect(result).toBeDefined();
        })

        it('should return success', async () => {
            mockOrchPutClientHomepassUc.initialFunction.mockResolvedValue({Response: EmessageMapping.NO_DATA_FOUND});
            const result = await service.consultPutClientHomepass('EC9_B2C',BodyExampleNotMigratedUser);
            expect(result).toBeDefined();
        })
        
        it('should return success', async () => {
            mockOrchPutClientHomepassUc.initialFunction.mockResolvedValue({Response: EmessageMapping.CLIENTE_OPERACION});
            const result = await service.consultPutClientHomepass('EC9_B2C',BodyExampleNotMigratedUser);
            expect(result).toBeDefined();
        })
    })
})