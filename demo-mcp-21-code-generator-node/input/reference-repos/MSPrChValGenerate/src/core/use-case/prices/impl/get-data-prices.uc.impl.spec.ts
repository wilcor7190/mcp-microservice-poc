import { IParamProvider } from "src/data-provider/param.provider";
import { IFileManagerProvider } from "src/data-provider/provider/downloadFile/file-manager.provider";
import { ISftpManagerProvider } from "src/data-provider/provider/downloadFile/sftp-manager.provider";
import { IPriceProvider } from "src/data-provider/provider/prices/price.provider";
import { ITransformPricesUc } from "../transform-prices.uc";
import { GetDataPricesUc } from "./get-data-prices.uc.impl";
import { TestingModule, Test } from "@nestjs/testing";
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import { FamilyParams } from "src/common/utils/enums/params.enum";
import { BusinessException } from 'src/common/lib/business-exceptions';
import { mockParamsPrices } from "src/mockup/stubs";
import { IParam } from "@claro/generic-models-library";


describe('GetDataPricesUc', () => {
  let service: GetDataPricesUc;
  let mockTransformPricesUc: jest.Mocked<ITransformPricesUc>;
  let mockPriceProvider: jest.Mocked<IPriceProvider>; IPriceProvider;
  let mockSftpManagerProvider: jest.Mocked<ISftpManagerProvider>;
  let mockFileManagerProvider: jest.Mocked<IFileManagerProvider>;
  let mockParamProvider: jest.Mocked<IParamProvider>;
  let mockIGetErrorTracingUc: jest.Mocked<IGetErrorTracingUc>;

  beforeEach(async () => {
    mockTransformPricesUc = {
      transformPrices: jest.fn(),
      paginationDB: jest.fn(),
      startVariables: jest.fn(),
    } as jest.Mocked<ITransformPricesUc>;

    mockPriceProvider = {
      deletePricesCollections: jest.fn(),
      saveTransformData: jest.fn(),
      productHasDuplicates: jest.fn(),
      deleteDataColPrtProductOffering: jest.fn(),
      getJoinPricesFeatures: jest.fn(),
    } as jest.Mocked<IPriceProvider>;

    mockSftpManagerProvider = {
      download: jest.fn(),
      downloadMovHom: jest.fn(),
      writeFile: jest.fn(),
    } as jest.Mocked<ISftpManagerProvider>;

    mockFileManagerProvider = {
      getDataCsv: jest.fn(),
      deleteFile: jest.fn(),
      saveDataTemporalCollection: jest.fn(),
      saveFile: jest.fn(),
      readLineFile: jest.fn(),
      transformFile: jest.fn(),
      readFile: jest.fn(),
      getDataCsvHeader: jest.fn(),
      saveDataTemporalCollectionHomes: jest.fn(),
      saveDataTemporalCollectionDisponibility: jest.fn(),
    } as jest.Mocked<IFileManagerProvider>;

    mockParamProvider = {
      getParamByIdParam: jest.fn().mockResolvedValue({ values: [] }),
      setLoadTime: jest.fn().mockResolvedValue({}),
      updateParam: jest.fn().mockResolvedValue({}),
      getTotal: jest.fn().mockResolvedValue({}),
      getParams: jest.fn().mockResolvedValue({}),
      getParamByIdParamPrices: jest.fn().mockResolvedValue({}),
      setLoadTimeExcp: jest.fn().mockResolvedValue({}),
      getFeaturesEnabled: jest.fn().mockResolvedValue({})

    } as jest.Mocked<IParamProvider>;



    mockIGetErrorTracingUc = {
      createTraceability: jest.fn(),
      getError: jest.fn(),
    } as jest.Mocked<IGetErrorTracingUc>;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetDataPricesUc,
        { provide: ITransformPricesUc, useValue: mockTransformPricesUc },
        { provide: IPriceProvider, useValue: mockPriceProvider },
        { provide: ISftpManagerProvider, useValue: mockSftpManagerProvider },
        { provide: IFileManagerProvider, useValue: mockFileManagerProvider },
        { provide: IParamProvider, useValue: mockParamProvider },
        { provide: IGetErrorTracingUc, useValue: mockIGetErrorTracingUc },

      ]
    }).compile();

    service = module.get<GetDataPricesUc>(GetDataPricesUc);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getNameCollection', () => {
    it('should return the name of the collection based on the nameFile', () => {
      const nameFile = FamilyParams.TerLibres;
      const result = service['getNameCollection'](nameFile);
      expect(result).toBe('COLPRTFREEEQUIPPRICES');
    });

    it('should return the name of the collection based on the nameFile kitprepago', () => {
      const nameFile = FamilyParams.kitprepago;
      const result = service['getNameCollection'](nameFile);
      expect(result).toBe('COLPRTKITPREPAIDPRICES');
    });

    it('should return the name of the collection based on the nameFile technology', () => {
      const nameFile = FamilyParams.technology;
      const result = service['getNameCollection'](nameFile);
      expect(result).toBe('COLPRTTECHNOLOGYPRICES');
    });


    it('should return und for unknown nameFile', () => {
      const nameFile = FamilyParams.posPlaDat;
      const result = service['getNameCollection'](nameFile);
      expect(result).toBeNull();
    });

  });

  describe('getSftpFiles', () => {

    it('should call getSftpFiles', async () => {
      jest.spyOn(service, 'getSftpFiles')
      mockParamProvider.getParamByIdParam.mockResolvedValue(mockParamsPrices as IParam)
      await service.getSftpFiles()
      expect(mockParamProvider.setLoadTime).toHaveBeenCalled()
      expect(mockPriceProvider.deletePricesCollections).toHaveBeenCalled()
      expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled()
      expect(mockSftpManagerProvider.download).toHaveBeenCalled()
      expect(mockParamProvider.getParamByIdParam).toHaveBeenCalled()
      expect(service.getSftpFiles).toHaveBeenCalledTimes(1)

    });

    it(' getSftpFiles error', async () => {
      jest.spyOn(service, 'getSftpFiles').mockRejectedValue(new BusinessException());
      try {
        await service.getSftpFiles();
        mockParamProvider.getParamByIdParam.mockRejectedValue(new Error());
        expect(mockIGetErrorTracingUc.createTraceability).toHaveBeenCalled();
      } catch (error) {
        expect(error).toBeInstanceOf(BusinessException);
      }
    });



  });


  describe('saveDataBD', () => {
    it('saveDataBD Terminales', async () => {
      const content = [
        {
          "Base_Comercial(ZTBC)": '49900',
          "Categoria_dia_Sin_IVA": 'NO APLICA',
          "Descrip_Comercial": 'Alcatel Onetouch Pixi 3 (4") + Negro',
          "Dto":
            { "_Comercial_Prom(ZD79)": '' },
          "Equipo": '70010932',
          "Ind_dia_Sin_IVA": '0',
          "IVA_repercutido(MWST)": '0',
          "IVA_SIM": '0',
          "Material_Padre": '70010932',
          "Menos_Simcard(ZD23)": '0',
          "Plan/Paquete": 'P24985',
          "Prec": { "_Equipo_con_IVA(ZP09)": '49900' },
          "Prec_sin_IVA_sin_SIM(ZP07)": '49900',
          "Precio_IVA_Final-Red(ZP05)": '49900',
          "Precio_sin_IVA(ZP06)": '49900',
          "Und_Disponibles": '0000',
        },
        {
          "Base_Comercial(ZTBC)": '49900',
          "Categoria_dia_Sin_IVA": 'NO APLICA',
          "Descrip_Comercial": 'Alcatel Onetouch Pixi 3 (4") + Negro',
          "Dto":
            { "_Comercial_Prom(ZD79)": '' },
          "Equipo": '70010932',
          "Ind_dia_Sin_IVA": '0',
          "IVA_repercutido(MWST)": '0',
          "IVA_SIM": '0',
          "Material_Padre": '70010932',
          "Menos_Simcard(ZD23)": '0',
          "Plan/Paquete": 'P24985',
          "Prec": { "_Equipo_con_IVA(ZP09)": '49900' },
          "Prec_sin_IVA_sin_SIM(ZP07)": '49900',
          "Precio_IVA_Final-Red(ZP05)": '49900',
          "Precio_sin_IVA(ZP06)": '49900',
          "Und_Disponibles": '0000',
        }
      ]
      const family = 'TerminalesLibres';
      const coleccion = 'COLPRTFREEEQUIPPRICES';
      const result = await service['saveDataBD'](content, family, coleccion);

      await mockFileManagerProvider.saveDataTemporalCollection(coleccion, content)
      expect(mockFileManagerProvider.saveDataTemporalCollection).toHaveBeenCalled()
      expect(result).toBeDefined();
    });

    it('saveDataBD Error', async () => {
      const family = 'TerminalesLibres';
      const coleccion = 'COLPRTFREEEQUIPPRICES';
      const content = {} as any;
      const result = await service['saveDataBD'](content, family, coleccion);
      mockFileManagerProvider.saveDataTemporalCollection.mockRejectedValue(new Error());
      expect(mockIGetErrorTracingUc.getError).toHaveBeenCalled();
    });



  });

  it('obtenFamily', async () => {
    
    const family = 'TerminalesLibres';
    
    const result = await service['obtenFamily'](family);

    expect(result).toBe(family);
  });

  it('obtenFamily null', async () => {
    
    const family = null;
    
    const result = await service['obtenFamily'](family);

    expect(result).toBe(family);
  });

  it('obtenLoadTime', async () => {
    
    const family = 'TerminalesLibres';
    
    const result = await service['obtenLoadTime'](family);

    expect(result).toBe(family);
  });

  it('obtenLoadTime null', async () => {
    
    const family = null;
    
    const result = await service['obtenLoadTime'](family);

    expect(result).toBe(0);
  });




});
