import { Test, TestingModule } from "@nestjs/testing";
import { PutClientHomePassOperacionimpl } from "./putClientHomePassOperacion.impl";

describe('homepassOperacion', () => {
    let service: PutClientHomePassOperacionimpl;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                PutClientHomePassOperacionimpl,
            ]
        }).compile();
        service = module.get<PutClientHomePassOperacionimpl>(PutClientHomePassOperacionimpl);
    });

    describe('provitionalFunction', () => {
        it('provitionalFunction', async () => {
            const result = await service.provitionalFunction();
            expect(result).toBeDefined();
        })
    })
})
