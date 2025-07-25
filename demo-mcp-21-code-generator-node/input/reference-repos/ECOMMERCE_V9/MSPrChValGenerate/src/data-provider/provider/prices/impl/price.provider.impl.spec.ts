import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { GeneralModel } from '../../../model/general/general.model';
import { PriceProvider } from './price.provider.impl';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';
import DbConnection from "src/common/utils/dbConnection";
import { FamilyParams } from 'src/common/utils/enums/params.enum';
import { CollectionsNames } from 'src/common/utils/enums/collectionsNames.enum';
import databaseConfig from 'src/common/configuration/database.config';
 
describe('PriceProvider', () => {
  let provider: PriceProvider;
  let generalModel: Model<GeneralModel>;

  let serviceTracingMock: jest.Mocked<IServiceTracingUc>;
  let IGetErrorTracingUcMock: jest.Mocked<IGetErrorTracingUc>;

  beforeEach(async () => {
    IGetErrorTracingUcMock = {
      getError: jest.fn(),
      createTraceability: jest.fn(),
    } as jest.Mocked<IGetErrorTracingUc>;

    serviceTracingMock = {
      createServiceTracing: jest.fn(),
    } as jest.Mocked<IServiceTracingUc>; 

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PriceProvider,
        {
          provide: getModelToken(GeneralModel.name, databaseConfig.database),
          useValue: {
            find: jest.fn(),
            deleteMany: jest.fn(),
            insertMany: jest.fn(),
          },
        },
        {
          provide: IServiceTracingUc,
          useValue: serviceTracingMock,
        },
        {
          provide: IGetErrorTracingUc,
          useValue: IGetErrorTracingUcMock,
        }
      ],
    }).compile();

    provider = module.get<PriceProvider>(PriceProvider);
    generalModel = module.get<Model<GeneralModel>>(
      getModelToken(GeneralModel.name, databaseConfig.database),
    );
  });

  afterEach(() => {
    jest.restoreAllMocks(); // Restaura todos los mocks después de cada prueba
  });

    
  describe('saveTransformData', () => {
    it('should save transformed data', async () => {
      const content = {} as any;
      const insertManyResult = {} as any;

      // Mock del método insertMany que retorna el resultado de la inserción
      generalModel.insertMany = jest.fn().mockResolvedValue(insertManyResult);

      const result = await provider.saveTransformData(content);

      expect(result).toBe(insertManyResult);
      expect(generalModel.insertMany).toHaveBeenCalledWith(content);
    });
  });

  describe('deleteDataColPrtProductOffering', () => {
    it('should delete data with the given parameters', async () => {
      const params = { family: 'Family', type: 'Type' };
      const deleteManyResult = {} as any;

      // Mock del método deleteMany que retorna el resultado de eliminación
      generalModel.deleteMany = jest.fn().mockResolvedValue(deleteManyResult);

      const result = await provider.deleteDataColPrtProductOffering(params);

      expect(result).toBe(deleteManyResult);
      expect(generalModel.deleteMany).toHaveBeenCalled()
    });
  });

  it('deletePricesCollections', async () => {
    // Mock DbConnection para simular el comportamiento
    const mockDbConnection = {
      db: {
        collection: jest.fn().mockReturnThis(),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
      client: {
        close: jest.fn(),
      },
    };

    // Simula el método dbConnection() en el servicio
    jest.spyOn(DbConnection, 'dbConnection').mockResolvedValue(mockDbConnection);

    // Ejecuta el método deletePricesCollections con diferentes casos de familia
    await provider.deletePricesCollections(FamilyParams.TerLibres);
    expect(mockDbConnection.db.collection).toHaveBeenCalledWith(CollectionsNames.TERMINALES_LIBRES);
    expect(mockDbConnection.db.collection(CollectionsNames.TERMINALES_LIBRES).deleteMany).toHaveBeenCalledWith({});

    await provider.deletePricesCollections(FamilyParams.kitprepago);
    expect(mockDbConnection.db.collection).toHaveBeenCalledWith(CollectionsNames.TERMINALES_KIT_PREPAGO);
    expect(mockDbConnection.db.collection(CollectionsNames.TERMINALES_KIT_PREPAGO).deleteMany).toHaveBeenCalledWith({});

    await provider.deletePricesCollections(FamilyParams.technology);
    expect(mockDbConnection.db.collection).toHaveBeenCalledWith(CollectionsNames.TECNOLOGIA);
    expect(mockDbConnection.db.collection(CollectionsNames.TECNOLOGIA).deleteMany).toHaveBeenCalledWith({});

    // Verifica que client.close() se haya llamado en el bloque finally
    expect(mockDbConnection.client.close).toHaveBeenCalled();
  });

  it('throw error getJoinPricesFeatures', async () => {
    // Mock DbConnection para simular el comportamiento
    const mockDbConnection = {
      db: {
        collection: jest.fn().mockReturnValue({
          aggregate: jest.fn().mockReturnThis
        }),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
      client: {
        close: jest.fn(),
      },
    };

    // Simula el método dbConnection() en el servicio
    jest.spyOn(DbConnection, 'dbConnection').mockResolvedValue(mockDbConnection);

    await provider.getJoinPricesFeatures(CollectionsNames.TERMINALES_LIBRES, 'PO_Tec');
    expect(mockDbConnection.db.collection).toHaveBeenCalledWith(CollectionsNames.TERMINALES_LIBRES);

    // Verifica que client.close() se haya llamado en el bloque finally
    expect(mockDbConnection.client.close).toHaveBeenCalled();
  });
  it('getJoinPricesFeatures', async () => {
    // Mock DbConnection para simular el comportamiento
    const mockDbConnection = {
      db: {
        collection: jest.fn().mockReturnValue({
          aggregate: jest.fn().mockReturnValue({
            toArray: jest.fn().mockReturnThis
          })
        }),
        deleteMany: jest.fn().mockResolvedValue({}),
      },
      client: {
        close: jest.fn(),
      },
    };

    // Simula el método dbConnection() en el servicio
    jest.spyOn(DbConnection, 'dbConnection').mockResolvedValue(mockDbConnection);

    await provider.getJoinPricesFeatures(CollectionsNames.TERMINALES_LIBRES, 'PO_Tec');
    expect(mockDbConnection.db.collection).toHaveBeenCalledWith(CollectionsNames.TERMINALES_LIBRES);

    // Verifica que client.close() se haya llamado en el bloque finally
    expect(mockDbConnection.client.close).toHaveBeenCalled();
  });

  describe('getDescuentos', () => {
    it('should return correct aggregation pipeline for PO_Tec filter', () => {
      const expectedPipeline = [{
        '$addFields': {
          'filter': {
            '$concat': [
              'PO_Tec', '$Equipo'
            ]
          },
          'VENTA_SIN_DESCUENTO': {
            $sum: [{ '$toDouble': "$Base_Comercial(ZTBC)" }, { '$toDouble': "$IVA_repercutido(MWST)" }]
          },
          'PRECIO_BASE': { '$toDouble': "$Base_Comercial(ZTBC)" },
          'IMPUESTO_IVA': {
            $subtract: [{ '$toDouble': '$Prec._Equipo_con_IVA(ZP09)' }, { '$toDouble': '$Pr._Equipo_sin_IVA(ZC01)' }]
          },
          'IVA_SIN_DESCUENTO': { '$toDouble': "$IVA_repercutido(MWST)" },
        },
      }];

      const result = provider.getDescuentos();
      expect(result).toEqual(expectedPipeline);
    });

  });
});
