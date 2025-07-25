import { Test, TestingModule } from "@nestjs/testing";
import { AddressComplement } from "./addressComplement.service.impl"
import { ILvlFuncionalitiesUc } from "../../../core/use-case/resource/lvl-funcionalities.resource.uc";
import { IGlobalValidateService } from "../resources/globalValidate.service";
import {
    BodyExampleCase1,
  } from 'src/mockup/address-complement/address-complement.mock';
import { IAddressComplementUc } from "../../../core/use-case/procedures/addressComplment.uc";

const mockLvlFuncionalitiesUc = {
    validateData: jest.fn(),
    mapAlternateGeographicAddress: jest.fn(),
    mapComplements: jest.fn()
};

const mockAddressComplementUc = {
    requestAddressComplement: jest.fn()
};

const mockGlobalValidateService = {
    validateChannel: jest.fn()
}

describe('AddressComplement', () => {
    let service: AddressComplement;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [],
            providers: [
                AddressComplement,
                { provide: ILvlFuncionalitiesUc, useValue: mockLvlFuncionalitiesUc },
                { provide: IAddressComplementUc, useValue: mockAddressComplementUc },
                { provide: IGlobalValidateService, useValue: mockGlobalValidateService }
            ]
        }).compile();

        service = module.get<AddressComplement>(AddressComplement);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
      });
      
    describe('consultAddressComplement', () => {
        it('should return success', async () => {
            mockAddressComplementUc.requestAddressComplement.mockResolvedValue({po_data:['TEST']});
            mockLvlFuncionalitiesUc.mapAlternateGeographicAddress.mockResolvedValue({});
            mockLvlFuncionalitiesUc.mapComplements.mockResolvedValue({});
            const result = await service.consultAddressComplement('EC9_B2C',BodyExampleCase1);
            expect(result).toBeDefined();
        })
    })
})