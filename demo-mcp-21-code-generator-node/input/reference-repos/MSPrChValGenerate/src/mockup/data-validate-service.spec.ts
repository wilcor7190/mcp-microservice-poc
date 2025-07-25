import { dataFailed, dataFailedFindDisponibility, dataSuccess, dataSuccessFindDisponibility } from "./data-validate-service";

describe('dataFailed', () => {
    it('correct value dataFailed', () => {
        expect(dataFailed.origen).toEqual('/MSAbCaAlarDisponibility/V1/AsycloadManuals');
        expect(dataFailed.message).toEqual('¡Ups¡, parece que algo salió mal, inténtalo nuevamente.');
        expect(dataFailed.documents).toEqual("Cannot GET /V1/AsycloadManuals")
    });
});

describe('dataSuccess', () => {
    it('correct value dataSuccess', () => {
        expect(dataSuccess.origen).toEqual('/MSAbCaAlarDisponibility/V1/AsynloadManual');
        expect(dataSuccess.success).toBe(true)
        expect(dataSuccess.message).toEqual("La Carga ha iniciado")
    });
});

describe('dataSuccessFindDisponibility', () => {
    it('correct value dataSuccessFindDisponibility', () => {
        expect(dataSuccessFindDisponibility.origen).toEqual('/MSAbCaAlarDisponibility/V1/loadManual');
        expect(dataSuccessFindDisponibility.status).toEqual(200);
        expect(dataSuccessFindDisponibility.message).toEqual("Execution successful")
    });
});

describe('dataFailedFindDisponibility', () => {
    it('correct value dataFailedFindDisponibility', () => {
        expect(dataFailedFindDisponibility.origen).toEqual('/MSAbCaAlarDisponibility/V1/loadManual');
        expect(dataFailedFindDisponibility.success).toBe(false)
        expect(dataFailedFindDisponibility.message).toEqual("¡Ups¡, parece que algo salió mal, inténtalo nuevamente.")
    });
});