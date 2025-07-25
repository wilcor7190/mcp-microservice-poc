import { Test, TestingModule } from "@nestjs/testing"
import { OrchHomePassUcimpl } from "./orchHomepass.uc.impl";
import { IHomepassOperacion } from "../operation/homepassOperacion";
import { IHomePassUc } from "../inspira/homePass.uc";

describe('OrchHomePassUcimpl', () => {
    let service: OrchHomePassUcimpl;
    const mockHomePassOperacion ={
        provitionalFunction: jest.fn()
    }
    const mockHomePassUc = {
        initialFunction: jest.fn()
    }
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                OrchHomePassUcimpl,
                { provide: IHomepassOperacion, useValue: mockHomePassOperacion },
                { provide: IHomePassUc, useValue: mockHomePassUc }
            ]
        }).compile();
        service = module.get<OrchHomePassUcimpl>(OrchHomePassUcimpl);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('orchHomePass', () => {
        it('initialFunction migratedUser true', async () => {
            mockHomePassOperacion.provitionalFunction.mockResolvedValue({});
            const result = await service.initialFunction({isMigratedUser: true},"EC9_B2C");
            expect(result).toBeDefined();
        })

        it('initialFunction migratedUser true', async () => {
            mockHomePassUc.initialFunction.mockResolvedValue({});
            const result = await service.initialFunction({isMigratedUser: false},"EC9_B2C");
            expect(result).toBeDefined();
        })
    })
})