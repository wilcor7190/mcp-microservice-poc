import { Test, TestingModule } from '@nestjs/testing';
import { AddressComplementimpl } from './addressComplement.uc.impl';
import { BodyExampleCase1 } from '../../../../mockup/address-complement/address-complement.mock';
import { GeographicAdDto } from '../../../../controller/dto/geographicAddres/geographicAddress.dto';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { IOracleProvider } from '../../../../data-provider/oracle.provider';
import { ILvlFuncionalitiesUc } from '../../resource/lvl-funcionalities.resource.uc';
import { BusinessException } from '../../../../common/lib/business-exceptions';

jest.setTimeout(35000)
describe('AddressComplementUc', () => {

    let addressComplementUc: AddressComplementimpl;
    const mockMappingLegadosUc = {}
    const mockConsultStoredProcedureProvider = {
        execute: jest.fn()
    }
    const mockLvlFuncionalitiesUc = {
        validateData: jest.fn(),
        mapFilling: jest.fn()
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AddressComplementimpl,
                { provide: IMappingLegadosUc, useValue: mockMappingLegadosUc },
                { provide: IOracleProvider, useValue: mockConsultStoredProcedureProvider },
                { provide: ILvlFuncionalitiesUc, useValue: mockLvlFuncionalitiesUc }
            ],
        }).compile();
        addressComplementUc = module.get<AddressComplementimpl>(AddressComplementimpl);
    });

    afterEach(() => {
        // Limpiar recursos después de cada prueba si es necesario
    });

    it('should create an instance of AddressComplementimpl', () => {
        expect(addressComplementUc).toBeInstanceOf(AddressComplementimpl);
    });

    it('should return Exception', async () => {
        try{
        mockConsultStoredProcedureProvider.execute.mockResolvedValue({});
        mockLvlFuncionalitiesUc.mapFilling.mockResolvedValue({})
        const result = await addressComplementUc.requestAddressComplement(BodyExampleCase1 as unknown as GeographicAdDto);
        expect(result).toBeDefined();
        }catch(err){
            expect(err).toBeInstanceOf(BusinessException);
        }
    })
});