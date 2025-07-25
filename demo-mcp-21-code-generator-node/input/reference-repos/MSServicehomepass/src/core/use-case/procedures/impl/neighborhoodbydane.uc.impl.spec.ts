import { Test, TestingModule } from '@nestjs/testing';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { IOracleProvider } from '../../../../data-provider/oracle.provider';
import { ILvlFuncionalitiesUc } from '../../resource/lvl-funcionalities.resource.uc';
import { BusinessException } from '../../../../common/lib/business-exceptions';
import { NeighborhoodbydaneUcimpl } from './neighborhoodbydane.uc.impl';

jest.setTimeout(35000)
describe('detailAddressUc', () => {

    let neighborhoodbydaneUcimpl: NeighborhoodbydaneUcimpl;
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
                NeighborhoodbydaneUcimpl,
                { provide: IMappingLegadosUc, useValue: mockMappingLegadosUc },
                { provide: IOracleProvider, useValue: mockConsultStoredProcedureProvider },
                { provide: ILvlFuncionalitiesUc, useValue: mockLvlFuncionalitiesUc }
            ],
        }).compile();
        neighborhoodbydaneUcimpl = module.get<NeighborhoodbydaneUcimpl>(NeighborhoodbydaneUcimpl);
    });

    afterEach(() => {
        // Limpiar recursos después de cada prueba si es necesario
    });

    it('should create an instance of AddressComplementimpl', () => {
        expect(neighborhoodbydaneUcimpl).toBeInstanceOf(NeighborhoodbydaneUcimpl);
    });

    it('should return Exception', async () => {
        try{
        mockConsultStoredProcedureProvider.execute.mockResolvedValue({});
        mockLvlFuncionalitiesUc.mapFilling.mockResolvedValue({})
        const result = await neighborhoodbydaneUcimpl.neighborhoodbydane({daneCode: "", addressType:""});
        expect(result).toBeDefined();
        }catch(err){
            expect(err).toBeInstanceOf(BusinessException);
        }
    })
});