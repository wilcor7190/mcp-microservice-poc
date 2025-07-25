import { Test } from '@nestjs/testing';
import { StructuresController } from './structures.controller';
import { IStructuresService } from './service/structure.service';
import { Structures } from './service/impl/structures.service.impl';
import { BodyExample, BodyFakeDataValidation, BodyFakeLegacy, Structures_200, Structures_201, Structures_400 } from 'src/mockup/structures/structures.mock';


describe('StructuresController', () => {
  let service: IStructuresService;
  let controller: StructuresController;
  let mockService: Pick<Structures, 'consultStructures'>;

  beforeEach(async () => {

    mockService = {
      consultStructures: jest.fn()
    }
    const module = await Test.createTestingModule({
      controllers: [StructuresController],
      providers: [
        { provide: IStructuresService, useValue: mockService },
      ],
    }).compile();
    controller = module.get<StructuresController>(StructuresController);
    service = module.get<IStructuresService>(IStructuresService);
  });

  describe('consultStructures endpoint', () => {
    it('should return 200', async () => {
      jest.spyOn(service, 'consultStructures').mockResolvedValueOnce(Structures_200);
      const result = await controller.consultStructures(`EC9_B2C`, BodyExample);
      expect(result).toBe(Structures_200);
      expect(result.status).toBe(200);
    });

    it('should return 201', async () => {
      jest.spyOn(service, 'consultStructures').mockResolvedValueOnce(Structures_201);
      const result = await controller.consultStructures(`EC9_B2C`, BodyFakeLegacy);
      expect(result).toBe(Structures_201);
      expect(result.status).toBe(201);
    });

    it('should return 400 data validation', async () => {
      
        jest.spyOn(service, 'consultStructures').mockResolvedValueOnce(Structures_400);
        const result = await controller.consultStructures(`EC9_B2C`, BodyFakeDataValidation);
        expect(result).toBe(Structures_400);
        expect(result.status).toBe(400);
    });

  });
});
