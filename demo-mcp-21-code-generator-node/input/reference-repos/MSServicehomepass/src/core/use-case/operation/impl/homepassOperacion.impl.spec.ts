import { Test, TestingModule } from "@nestjs/testing";
import { HomepassOperacion } from "./homepassOperacion.impl";

describe('homepassOperacion', () => {
    let service: HomepassOperacion;
    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers:[
                HomepassOperacion,
            ]
        }).compile();
        service = module.get<HomepassOperacion>(HomepassOperacion);
    });

    describe('provitionalFunction', () => {
        it('provitionalFunction', async () => {
            const result = await service.provitionalFunction();
            expect(result).toBeDefined();
        })
    })
})
