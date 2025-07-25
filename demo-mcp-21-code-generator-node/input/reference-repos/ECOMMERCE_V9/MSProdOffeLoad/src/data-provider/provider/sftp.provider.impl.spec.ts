import { Test, TestingModule } from '@nestjs/testing';
import { SftpProvider } from './sftp.provider.impl';

describe('SftpManagerProvider', () => {
  let service: SftpProvider;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SftpProvider],
    }).compile();

    service = module.get<SftpProvider>(SftpProvider);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
