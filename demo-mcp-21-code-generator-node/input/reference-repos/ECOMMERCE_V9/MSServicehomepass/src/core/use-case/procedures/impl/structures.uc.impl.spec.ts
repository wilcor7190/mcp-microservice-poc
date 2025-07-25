import { IOracleProvider } from 'src/data-provider/oracle.provider';
import { IMappingLegadosUc } from '../../resource/mapping-legaos.resource.uc';
import { StructuresUc } from './structures.uc.impl';
import { ILvlFuncionalitiesUc } from '../../resource/lvl-funcionalities.resource.uc';
import { Test } from '@nestjs/testing';

describe('structures impl', () => {
  let structuresUc: Partial<StructuresUc>;
  let mappingLegados: IMappingLegadosUc;
  let consultaStoresProceduredProvider;
  let lvlFuncionalitiesUc;
  const body = {
    "geographicAddressList": {
      "geographicAddress": {
        "daneCode": 66682000,
        "neighborhood": "LOS BLOQUES",
        "addressType": "BM"
      },
      "complements": {
      },
      "alternateGeographicAddress": {
        "nivel4Type": "MANZANA",
        "nivel4Value": "A",
        "nivel5Type": "CASA",
        "nivel5Value": "1"
      },
      "plateTypeIt": "",
      "plateValueIt": ""
    }
  }

  beforeEach(async () => {
    mappingLegados = {
      consumerLegadoRest: jest.fn(),
      consumerLegadoRestJOB: jest.fn(),
      consumerLegadoRestPost: jest.fn(),
    };

    consultaStoresProceduredProvider = {
      execute: jest.fn(),
    };

    lvlFuncionalitiesUc = {
      mapAlternateGeographicAddress: jest.fn(),
      mapComplements: jest.fn(),
      mapFilling: jest.fn(),
      segmentationByType: jest.fn(),
      validateData: jest.fn(),
    };
    const module = await Test.createTestingModule({
      providers: [
        StructuresUc,
        { provide: IMappingLegadosUc, useValue: mappingLegados },
        { provide: IOracleProvider, useValue: consultaStoresProceduredProvider },
        { provide: ILvlFuncionalitiesUc, useValue: lvlFuncionalitiesUc },
      ],
    }).compile();
    structuresUc = module.get<StructuresUc>(StructuresUc);
  });

  describe('StructuresUc - methods', () => {

    it('initial function', async () => {
      lvlFuncionalitiesUc.validateData.mockResolvedValue({});
      lvlFuncionalitiesUc.mapFilling.mockResolvedValue(['OTRO']);
      consultaStoresProceduredProvider.execute.mockResolvedValue({ po_codigo: 0 })
      let result= structuresUc.initialFunction(body);
      expect(result).toBeDefined();
    });

  });
});
