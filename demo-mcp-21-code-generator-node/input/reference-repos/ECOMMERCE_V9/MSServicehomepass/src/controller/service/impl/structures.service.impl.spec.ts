import { Test, TestingModule } from '@nestjs/testing';
import { Structures } from './structures.service.impl';
import { IGlobalValidateService } from '../resources/globalValidate.service';
import { IOrchStructuresUc } from '../../../core/use-case/procedures/structures.uc';
import { ILvlFuncionalitiesUc } from '../../../core/use-case/resource/lvl-funcionalities.resource.uc';
import { StructuresDTO } from '../../dto/structures/structures.dto';

describe('structuresImpl', () => {
  const mockGlobalValidateService = {
    validateChannel: jest.fn()
  }
  const mockOrchStructuresUc = {
    initialFunction: jest.fn()
  }

  const mockIlvlFunctionality = {
    validateData: jest.fn(),
    segmentationByType: jest.fn()
  }
  let service: Structures;
  beforeEach( async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers:[
        Structures,
        { provide: IOrchStructuresUc, useValue: mockOrchStructuresUc },
        { provide: IGlobalValidateService, useValue: mockGlobalValidateService },
        { provide: ILvlFuncionalitiesUc, useValue: mockIlvlFunctionality }
      ]
    }).compile();

    service = module.get<Structures>(Structures)
  })

  it('should be defined', () => {
    expect(service).toBeDefined();
  })

  it('should get structure', () => {
    let struc = new StructuresDTO()
    mockGlobalValidateService.validateChannel.mockResolvedValue(true)
    mockOrchStructuresUc.initialFunction.mockResolvedValue([{PPO_DIRECCION_ID:''}])
    let result = service.consultStructures(struc, "EC9_B2C")
    expect(result).toBeDefined()
  })
})