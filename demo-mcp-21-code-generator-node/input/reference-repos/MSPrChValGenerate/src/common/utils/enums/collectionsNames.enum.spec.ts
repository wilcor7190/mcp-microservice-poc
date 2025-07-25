import { CollectionsNames } from "./collectionsNames.enum";

describe('CollectionsNames should have correct values', () => {

    it('DISPONIBILITY_FILE should --> "DISPONIBILITY_FILE"', () => {
        expect(CollectionsNames.TERMINALES_LIBRES).toBe('COLPRTFREEEQUIPPRICES');
    });

    it('DISPONIBILITY should be --> "DISPONIBILITY"', () => {
        expect(CollectionsNames.TERMINALES_KIT_PREPAGO).toBe('COLPRTKITPREPAIDPRICES');
    })

    it('EQUIPMENT should be --> "EQUIPMENT"', () => {
        expect(CollectionsNames.TECNOLOGIA).toBe('COLPRTTECHNOLOGYPRICES');
    })
    it('EQUIPMENT should be --> "EQUIPMENT"', () => {
        expect(CollectionsNames.CARACTERISTICAS).toBe('COLPRTTTATTRIBUTES');
    })
    it('EQUIPMENT should be --> "EQUIPMENT"', () => {
        expect(CollectionsNames.HOGARESATTRIBUTES).toBe('COLPRTHOMEATTRIBUTES');
    })
    it('EQUIPMENT should be --> "EQUIPMENT"', () => {
        expect(CollectionsNames.HOGARESPRICES).toBe('COLPRTHOMEPRICES');
    })
    it('EQUIPMENT should be --> "EQUIPMENT"', () => {
        expect(CollectionsNames.MOVILATTRIBUTES).toBe('COLPRTPREPOATTRIBUTES');
    })
    it('EQUIPMENT should be --> "EQUIPMENT"', () => {
        expect(CollectionsNames.MOVILPRICES).toBe('COLPRTPREPOPRICES');
    })
 

    it('total eneums', () => {
        expect(Object.keys(CollectionsNames).length).toBe(9);
    });
});