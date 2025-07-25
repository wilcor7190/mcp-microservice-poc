import Traceability from './traceability';
import { Test, TestingModule } from '@nestjs/testing';
import { EStatusTracingGeneral } from '../../common/utils/enums/tracing.enum';
import { ETaskMessageGeneral } from '../../common/utils/enums/message.enum';

describe('Traceability Class', () => {
  let service: Traceability;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Traceability],
    }).compile();

    service = module.get<Traceability>(Traceability);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Generate Traceability', () => {
    let service = new Traceability({});
    service.setOrigen('TEST ORIGIN ');
    service.setStatus(EStatusTracingGeneral.STATUS_SUCCESS);
    service.setDescription(ETaskMessageGeneral.GET_BY_ID);
    service.setTask(ETaskMessageGeneral.GET_BY_ID);
    const result = service.getTraceability();

    expect(result).toBeDefined();
  });
});
