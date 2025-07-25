import { Test, TestingModule } from '@nestjs/testing';
import { BodyExampleCase1 } from '../../../../mockup/address-complement/address-complement.mock';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { IOracleProvider } from '../../../../data-provider/oracle.provider';
import { ILvlFuncionalitiesUc } from '../../resource/lvl-funcionalities.resource.uc';
import { BusinessException } from '../../../../common/lib/business-exceptions';
import { DetailAdderessimpl } from './detailAddress.uc.impl';
import { GeographicDto } from '../../../../controller/dto/geographic/geographic.dto';

jest.setTimeout(35000)
describe('detailAddressUc', () => {

    let detailAdderessimpl: DetailAdderessimpl;
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
                DetailAdderessimpl,
                { provide: IMappingLegadosUc, useValue: mockMappingLegadosUc },
                { provide: IOracleProvider, useValue: mockConsultStoredProcedureProvider },
                { provide: ILvlFuncionalitiesUc, useValue: mockLvlFuncionalitiesUc }
            ],
        }).compile();
        detailAdderessimpl = module.get<DetailAdderessimpl>(DetailAdderessimpl);
    });

    afterEach(() => {
        // Limpiar recursos después de cada prueba si es necesario
    });

    it('should create an instance of AddressComplementimpl', () => {
        expect(detailAdderessimpl).toBeInstanceOf(DetailAdderessimpl);
    });

    it('should return Exception', async () => {
        try{
        mockConsultStoredProcedureProvider.execute.mockResolvedValue({});
        mockLvlFuncionalitiesUc.mapFilling.mockResolvedValue({})
        const result = await detailAdderessimpl.detailAddress(BodyExampleCase1 as unknown as GeographicDto);
        expect(result).toBeDefined();
        }catch(err){
            expect(err).toBeInstanceOf(BusinessException);
        }
    })

    it('should return fill functions', async () => {
        const result = await detailAdderessimpl.fillGeo([]);
        const result1 = await detailAdderessimpl.fillSubGeo([]);
        const result2 = await detailAdderessimpl.fillAlternate([]);
        const result3 = await detailAdderessimpl.fillPostAlt([]);
        expect(result).toBeDefined();
        expect(result1).toBeDefined();
        expect(result2).toBeDefined();
        expect(result3).toBeDefined();
    })
});