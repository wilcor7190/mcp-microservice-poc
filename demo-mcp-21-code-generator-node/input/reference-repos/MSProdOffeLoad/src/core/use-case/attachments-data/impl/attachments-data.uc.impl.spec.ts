import { Test, TestingModule } from '@nestjs/testing';
import { ISftpProvider } from '../../../../data-provider/sftp.provider';
import {
  dataCategories
} from '../../../../../test/response-dummy';
import { IServiceErrorUc } from '../../resource/service-error.resource.uc';
import { IServiceTracingUc } from '../../resource/service-tracing.resource.uc';
import { AttachmentsDataUC } from './attachments-data.uc.impl';
import CreateCsv from '../../../../common/utils/createCsv';
jest.mock('../../../../common/utils/createCsv'); 


describe('AttachmentsDataUC', () => {
  let attachmentsDataUC: AttachmentsDataUC;
  let ISftpProviderMock: jest.Mocked<ISftpProvider>;
  let IServiceErrorUcMock: jest.Mocked<IServiceErrorUc>;
  let IServiceTracingUcMock: jest.Mocked<IServiceTracingUc>;

  ISftpProviderMock = {
    readFileImg: jest.fn(),
    update: jest.fn(),
  } as jest.Mocked<ISftpProvider>;

  IServiceErrorUcMock = {
    createServiceError: jest.fn(),
  } as jest.Mocked<IServiceErrorUc>;

  IServiceTracingUcMock = {
    createServiceTracing: jest.fn(),
  } as jest.Mocked<IServiceTracingUc>;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttachmentsDataUC,
        { provide: ISftpProvider, useValue: ISftpProviderMock },
        { provide: IServiceErrorUc, useValue: IServiceErrorUcMock },
        { provide: IServiceTracingUc, useValue: IServiceTracingUcMock },
      ],
    }).compile();

    attachmentsDataUC = module.get<AttachmentsDataUC>(AttachmentsDataUC);
  });

  afterEach(() => {
    jest.clearAllMocks();

  });

  it('should call the necessary methods to create dataload', async () => {
    ISftpProviderMock.readFileImg.mockResolvedValue([
      {
        type: '',
        name: '',
        size: 10,
        modifyTime: 10,
        accessTime: 10,
        rights: {
          user: '',
          group: '',
          other: ''
        },
        owner: 100,
        group: 100,
        longname: ''
      }
    ])


    const path = '/path/to/dataload.csv';
    const pathB2b = '/path/to/dataload.csv';

    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);

    // Call the method
    jest.spyOn(attachmentsDataUC, 'dataLoadConfiguration');
    await attachmentsDataUC.dataLoadConfiguration(dataCategories, path, pathB2b);

    // Assertions
    expect(ISftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'CatalogEntryAsset',
      'attachment_data_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'attachment_data_0',
      expect.any(String),
    );
  });
  it('should call the necessary methods without info from sftp provider', async () => {
    const path = '/path/to/dataload.csv';
    const pathB2b = '/path/to/dataload.csv';

    (CreateCsv.createCsv as jest.Mock).mockResolvedValue(undefined);
    (CreateCsv.unificateFiles as jest.Mock).mockResolvedValue(undefined);

    // Call the method
    jest.spyOn(attachmentsDataUC, 'dataLoadConfiguration');
    await attachmentsDataUC.dataLoadConfiguration(dataCategories, path, pathB2b);

    // Assertions
    expect(ISftpProviderMock.update).toHaveBeenCalledWith(expect.any(String), path);
    expect(CreateCsv.createCsv).toHaveBeenCalledWith(
      expect.any(Array),
      expect.any(String),
      expect.any(Array),
      'CatalogEntryAsset',
      'attachment_data_0',
    );
    expect(CreateCsv.unificateFiles).toHaveBeenCalledWith(
      'attachment_data_0',
      expect.any(String),
    );
  });
});
