
import { EDescriptionTracingGeneral, EStatusTracingGeneral, ETaskTracingGeneral } from "./tracing.enum";

describe('tracing catalog should have correct values', () => {
    it('EStatusTracingGeneral" ', () => {
        expect(EStatusTracingGeneral.STATUS_SUCCESS).toBe("SUCCESS");
        expect(EStatusTracingGeneral.STATUS_FAILED).toBe("FAILED");
    });

    it('total enums', () => {
        expect(Object.keys(EStatusTracingGeneral).length).toBe(10);
    });    

    it('total enums', () => {
        expect(Object.keys(ETaskTracingGeneral).length).toBe(25);
    });
    
    it('total enums', () => {
        expect(Object.keys(EDescriptionTracingGeneral).length).toBe(44);
    });  
})
