import { Test, TestingModule } from '@nestjs/testing';
import { OracleProvider } from './oracle.provider.impl';
import { Span } from 'elastic-apm-node';
const oracledb = require('oracledb');
import ApmService from 'src/common/utils/apm-service';
import databaseConfig from 'src/common/configuration/database.config';
import Logging from 'src/common/lib/logging';
import { IServiceTracingUc } from 'src/core/use-case/resource/service-tracing.resource.uc';
import { ENameCursorDB } from 'src/common/utils/enums/store-procedure.enum';

jest.mock('oracledb', () => ({
  getConnection: jest.fn().mockResolvedValue({
    execute: jest.fn().mockResolvedValue({outBinds:{
      po_codigo: 'a',
      po_descripcion: 'b',
      PO_COMPLEMENTOS: 'c',
    }}),
    ping: jest.fn().mockResolvedValue(true),
  }),
}));
jest.setTimeout( Math.ceil(Number(databaseConfig.timeout)*4+10000));
describe('OracleProvider', () => {
  let oracleProvider: OracleProvider;
  let serviceTracingMock: Partial<IServiceTracingUc>;

  beforeEach(async () => {
    jest.spyOn(OracleProvider.prototype, 'dataFromResultSet').mockImplementation(jest.fn())
    jest.spyOn(Logging.prototype, 'write').mockImplementation(jest.fn());
    serviceTracingMock = {
      createServiceTracing: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [OracleProvider,
        {provide: IServiceTracingUc, useValue: serviceTracingMock}
      ],
    }).compile();

    oracleProvider = module.get<OracleProvider>(OracleProvider);
  });

  describe('Methods of Oracle Provider', () => {
    it('Oracle connection', async () => {
      jest.spyOn(ApmService, 'startSpan').mockReturnValue({ end: jest.fn() } as unknown as Span);
      oracleProvider.onModuleInit();

      /*Since there's a settimeout in logic with 10 secs
       * it's necessary to wait until the internal function is
       * completed. It's not directly possible to use await
       * due to function is not asynchronic and its nature
       * calling private methods.
       * Also, that's why jest.setTimeout() is present
       * */
      await new Promise((resolve) => setTimeout(resolve, Math.ceil(Number(databaseConfig.timeout)) + 1000));
      const connection = OracleProvider.ORACLE_CLIENT_CONNECTION;
      expect(connection).toBeDefined();

      // Only after connection is set, execute can be called
      const result = await oracleProvider.execute('qstrg', {}, 'name', ENameCursorDB.CONSULTA_COMPLEMENTOS, true);
      await new Promise((resolve) => setTimeout(resolve, Math.ceil(2 * Number(databaseConfig.timeout)) + 2000));

      expect(result).toBeDefined;
    });

    it('Oracle connection', async () => {
      jest.resetAllMocks();
      jest.spyOn(ApmService, 'startSpan').mockReturnValue({ end: jest.fn() } as unknown as Span);
      jest
        .spyOn(oracledb, 'getConnection')
        .mockImplementationOnce(()=> new Promise((resolve, reject) => {
        }));
      oracleProvider.onModuleInit();

       await new Promise((resolve) => setTimeout(resolve, Math.ceil(Number(databaseConfig.timeout)) + 1000));
       expect(Logging.prototype.write).toHaveBeenCalledTimes(3);


    });
  });
});


/*When testing and the only provider is the test class in question, 
it happens that the class is declared with undefined static variables
that are assigned as the flow progresses. NO way was found to mock those static variables.
Whenever the test is called, the static variables appear as undefined. 
Somehow, the implementing class configured in the test turns out to be different
from the implementing class of which its instance is called to test.
In summary, calling directly oracleProvider.execute() is not possible for testing,
since ORACLE_CLIENT_CONNECTION cannot be mocked.
*/
