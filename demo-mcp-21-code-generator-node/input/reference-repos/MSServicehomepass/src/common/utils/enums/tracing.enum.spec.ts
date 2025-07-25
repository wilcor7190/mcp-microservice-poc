import { EStatusTracingGeneral, ETaskTracingGeneral } from './tracing.enum';

describe('EStatusTracingGeneral should have correct values', () => {
  it('EStatusTracingGeneral" ', () => {
    expect(EStatusTracingGeneral.STATUS_SUCCESS).toBe('SUCCESS');
    expect(EStatusTracingGeneral.STATUS_FAILED).toBe('FAILED');
    expect(EStatusTracingGeneral.STATUS_PENDIENTE).toBe('PENDIENTE');
  });
  it('total enums', () => {
    expect(Object.keys(EStatusTracingGeneral).length).toBe(11);
  });
});

describe('ETaskTracingGeneral should have correct values', () => {
  it('ETaskTracingGeneral" ', () => {
    expect(ETaskTracingGeneral.DELETE_DATA_MOVIL).toBe('ELIMINACION DE DATOS');
    expect(ETaskTracingGeneral.DOWNLOAD_DATA).toBe('DESCARGA DE DATOS');
    expect(ETaskTracingGeneral.SAVE_DATA_MOVIL).toBe('GUARDADO DE DATOS');
    expect(ETaskTracingGeneral.EXEC_CRON).toBe('EJECUCION CRON');
    expect(ETaskTracingGeneral.EXEC_MANUAL).toBe('EJECUCION MANUAL');
    expect(ETaskTracingGeneral.INVALID_CHANNEL).toBe('INVALID CHANNEL');
    expect(ETaskTracingGeneral.TASK_GENERAL).toBe('TEST');
    expect(ETaskTracingGeneral.SAVE_DATA).toBe('GUARDADO DE DATOS');
    expect(ETaskTracingGeneral.DELETE_DATA).toBe('ELIMINACION DE DATOS');
    expect(ETaskTracingGeneral.FILE_DOWNLOAD).toBe('DESCARGANDO ARCHIVO');
    expect(ETaskTracingGeneral.SOLICITUD_POR_ID).toBe('BUSCAR SOLICITUD POR ID SOLICITUD');
    expect(ETaskTracingGeneral.CONSUMIR_CMATRICES).toBe('CONSULTAR LEGADO CMATRICESAS400');
    expect(ETaskTracingGeneral.GET_CUSREQUESTHOMEPASS).toBe('CONSULTAR DATOS EN CUSREQUESTHOMEPASS');
    expect(ETaskTracingGeneral.UPDATE_CUSREQUESTHOMEPASS).toBe('ACTUALIZAR DATOS EN CUSREQUESTHOMEPASS');
    expect(ETaskTracingGeneral.TRACING_SENDORDER).toBe('CONSUMO DEL END POINT SEND ORDER');
    expect(ETaskTracingGeneral.TRACING_PAYMENT).toBe('CONSUMO DEL END POINT PAYMENT');
    expect(ETaskTracingGeneral.TRACING_CAPACITY).toBe('CONSUMO DEL END POINT CAPACITY');
    expect(ETaskTracingGeneral.TRACING_CREATE_ORDER).toBe('CONSUMO DEL END POINT CREATE ORDER');
  });
  it('total enums', () => {
    expect(Object.keys(ETaskTracingGeneral).length).toBe(20);
  });
});
