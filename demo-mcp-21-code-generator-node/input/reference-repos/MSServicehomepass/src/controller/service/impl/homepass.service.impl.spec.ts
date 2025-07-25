import { Test, TestingModule } from "@nestjs/testing";
import { IGlobalValidateService } from "../resources/globalValidate.service";
import { HomePass } from "./homepass.service.impl";
import { EValidationHomepass } from "../../../common/utils/enums/homepass.enum";
import { BodyExampleNotMigratedUser } from "../../../mockup/homepass/home-pass.mock";
import { IOrchHomepassUc } from "../../../core/use-case/orchHomepass.uc";
import { EmessageMapping } from "../../../common/utils/enums/message.enum";
import { BusinessException } from "../../../common/lib/business-exceptions";

const mockGlobalValidateService = {
    validateChannel: jest.fn()
}

const mockOrchHomepassUc = {
    initialFunction: jest.fn()
}



describe('AddressComplement', () => {
    let service: HomePass;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                HomePass,
                { provide: IOrchHomepassUc, useValue: mockOrchHomepassUc },
                { provide: IGlobalValidateService, useValue: mockGlobalValidateService }
            ]
        }).compile();

        service = module.get<HomePass>(HomePass);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
      
    describe('consultHomePass', () => {
        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({message: EValidationHomepass.VALIDACION_STRATUM});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })

        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({message: EValidationHomepass.CON_SERVICIO});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })

        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({message: EValidationHomepass.CON_COBERTURA});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })
        
        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({message: EValidationHomepass.SIN_COBERTURA});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })

        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({message: EValidationHomepass.SIN_COBERTURA_STRATA_MINUSONE});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })

        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({code: '-1'});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })

        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({Response: "Cliente Inspira no Soportado"});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })
        
        it('should return success', async () => {
            try{
                mockOrchHomepassUc.initialFunction.mockResolvedValue({source: false});
                const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
                expect(result).toBeDefined();
            }catch(err){
                expect(err).toBeInstanceOf(BusinessException);
            }
        })

        it('should return success', async () => {
            mockOrchHomepassUc.initialFunction.mockResolvedValue({message: EValidationHomepass.HHPP_NO_EXISTE});
            const result = await service.consultHomePass(BodyExampleNotMigratedUser, 'EC9_B2C');
            expect(result).toBeDefined();
        })
    })
})