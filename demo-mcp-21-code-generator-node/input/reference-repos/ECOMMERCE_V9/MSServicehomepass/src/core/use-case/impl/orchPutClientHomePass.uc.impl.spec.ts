import { Test, TestingModule } from "@nestjs/testing"
import { OrchHomePassUcimpl } from "./orchHomepass.uc.impl";
import { IHomepassOperacion } from "../operation/homepassOperacion";
import { IHomePassUc } from "../inspira/homePass.uc";
import { OrchPutClientHomePassUcimpl } from "./orchPutClientHomePass.uc.impl";
import { IPutClientHomePassOperacion } from "../operation/PutClientHomePassOperacion";
import { IPutClientHomePass } from "../inspira/putClientHomePass";
import { IOrchPutClientHomePassUc } from "../orchPutClienHomePass.uc";

describe('OrchHomePassUcimpl', () => {
    let service: OrchPutClientHomePassUcimpl;
    const mockPutClientHomePassOperacion ={
        provitionalFunction: jest.fn()
    }
    const mockPutClientHomePassUc = {
        initialFunction: jest.fn()
    }
    const mockPutClientHomePass = {
        putClientHomePass: jest.fn()
    }

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                OrchPutClientHomePassUcimpl,
                { provide: IPutClientHomePassOperacion, useValue: mockPutClientHomePassOperacion },
                { provide: IPutClientHomePass, useValue: mockPutClientHomePass},
                { provide: IOrchPutClientHomePassUc, useValue: mockPutClientHomePassUc }
            ]
        }).compile();
        service = module.get<OrchPutClientHomePassUcimpl>(OrchPutClientHomePassUcimpl);
    });

    afterEach(() => {
        jest.resetAllMocks();
    });
    describe('orchHomePass', () => {
        it('initialFunction migratedUser true', async () => {
            mockPutClientHomePassOperacion.provitionalFunction.mockResolvedValue({});
            const result = await service.initialFunction({customer:{isMigratedUser: true}});
            expect(result).toBeDefined();
        })

        it('initialFunction migratedUser true', async () => {
            mockPutClientHomePassUc.initialFunction.mockResolvedValue({});
            mockPutClientHomePass.putClientHomePass.mockResolvedValue({});
            const result = await service.initialFunction({customer:{isMigratedUser: false}});
            expect(result).toBeDefined();
        })
    })
})