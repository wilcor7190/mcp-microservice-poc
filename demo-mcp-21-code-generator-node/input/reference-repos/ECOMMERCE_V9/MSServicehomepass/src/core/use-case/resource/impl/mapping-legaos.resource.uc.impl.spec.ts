import { Test, TestingModule } from '@nestjs/testing';
import { MappingLegadosUcimpl } from './mapping-legaos.resource.uc.impl';
import { IHomePass } from '../../../../data-provider/homePass.provider';

describe('Mapping Legados', () => {
    let mappingLegadosUcimpl: MappingLegadosUcimpl;
    const mockHomePass = {
        consumerServiceHomePass: jest.fn()
    }

    beforeEach(async () => {

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MappingLegadosUcimpl,
                { provide: IHomePass, useValue: mockHomePass }
            ]
        }).compile();

        mappingLegadosUcimpl = module.get<MappingLegadosUcimpl>(MappingLegadosUcimpl);
    });

    describe('mappingLegadosUcimpl', () => {

        it('should return defined', async () => {
            mockHomePass.consumerServiceHomePass.mockResolvedValue([]);
            const res = await mappingLegadosUcimpl.consumerLegadoRest({}, "");

            expect(res).toBeDefined();

        });

        it('should return defined', async () => {
            mockHomePass.consumerServiceHomePass.mockResolvedValue([]);
            const res = await mappingLegadosUcimpl.consumerLegadoRestJOB({}, "");

            expect(res).toBeDefined();

        });

        it('should return defined', async () => {
            mockHomePass.consumerServiceHomePass.mockResolvedValue([]);
            const res = await mappingLegadosUcimpl.consumerLegadoRestPost({}, "");

            expect(res).toBeDefined();

        });
    });
});
