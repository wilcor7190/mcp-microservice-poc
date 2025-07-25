
import { SftpManagerProvider } from './sftp-manager.provider.impl';
import { Test, TestingModule } from '@nestjs/testing';
import { IGetErrorTracingUc } from 'src/core/use-case/resource/get-error-tracing.resource.uc';



describe('SftpManagerProvider', () => {
    let service: SftpManagerProvider;
    let IGetErrorTracingUcMock: jest.Mocked<IGetErrorTracingUc>;


    beforeEach(async () => {


        IGetErrorTracingUcMock = {
            createTraceability: jest.fn(),
            getError: jest.fn(),
        } as jest.Mocked<IGetErrorTracingUc>;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                SftpManagerProvider,
                { provide: IGetErrorTracingUc, useValue: IGetErrorTracingUcMock },
            ],

        }).compile();

        service = module.get<SftpManagerProvider>(SftpManagerProvider);

    });

    afterEach(() => {
        jest.resetAllMocks();
    });


    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findFile', async () => {
        jest.spyOn(service, 'findFile')
        const data = [
            'MPrepago_16__20240505_111928',
            'MPospago_16_21_20240505_112134'
        ]
        const resul = await service.findFile(data);
        expect(resul).toBe(undefined)
        expect(service.findFile).toHaveBeenCalledTimes(1)
        expect(IGetErrorTracingUcMock.createTraceability).toHaveBeenCalled()

    });

    it('findFile', async () => {
        jest.spyOn(service, 'findDate')
        const data = [
            'MPrepago_16__20240505_111928',
            'MPospago_16_21_20240505_112134'
        ]
        const resul = await service.findDate(data);
        expect(resul).toBe("MPrepago_16__20240505_111928")
        expect(service.findDate).toHaveBeenCalledTimes(1)

    });

})