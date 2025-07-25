import { EStatusTracingGeneral } from "../utils/enums/tracing.enum";
import Traceability from "./traceability";

describe('Traceability Class', () => {

  it('Generate Traceability', () => {
    let traceability = new Traceability({});
    traceability.setStatus("SUCESS");
    traceability.setDescription("CHECK TRACEABILITY");
    traceability.setTask("TRACEABILITY");
    traceability.setOrigen("TRACEABILITY.SPEC");
    traceability.setRequest("REQUEST");
    traceability.setResponse("RESPONSE");
    traceability.getTraceability();
    expect(traceability.getTraceability()).toBeDefined();
  });

  it('succes getStatusTraceability', async () => {
    let traceability = new Traceability({});
    let response = traceability.getStatusTraceability({ executed: true, status: 200 });
    expect(response).toBeDefined();
    expect(response).toBe(EStatusTracingGeneral.LEGACY_SUCCESS);
  });

  it('warning getStatusTraceability', async () => {
    let traceability = new Traceability({});
    let response = traceability.getStatusTraceability({ executed: true, status: 401 });
    expect(response).toBeDefined();
    expect(response).toBe(EStatusTracingGeneral.LEGACY_WARN);
  });

  it('Error getStatusTraceability', async () => {
    let traceability = new Traceability({});
    let response = traceability.getStatusTraceability({ executed: false, status: 500 });
    expect(response).toBeDefined();
    expect(response).toBe(EStatusTracingGeneral.LEGACY_ERROR);
  });
})
