import { CollectionsNames } from "./collectionsNames.enum";

describe('CollectionsNames should have correct values', () => {

    it('EQUIPMENT should --> "EQUIPMENT"', () => {
        expect(CollectionsNames.EQUIPMENT).toBe('COLPRTEquipment');
    });

    it('TECHNOLOGY should be --> "TECHNOLOGY"', () => {
        expect(CollectionsNames.TECHNOLOGY).toBe('COLPRTTechnology');
    })

    it('POSPAGO should be --> "POSPAGO"', () => {
        expect(CollectionsNames.POSPAGO).toBe('COLPRTPospago');
    })

    it('PREPAGO should be --> "PREPAGO"', () => {
        expect(CollectionsNames.PREPAGO).toBe('COLPRTPrepago');
    })

    it('HOME should be --> "HOME"', () => {
        expect(CollectionsNames.HOME).toBe('COLPRTHomes');
    })

    it('LAST_PRICES should be --> "LAST_PRICES"', () => {
        expect(CollectionsNames.LAST_PRICES).toBe('COLLastPricesTT');
    })

    it('total eneums', () => {
        expect(Object.keys(CollectionsNames).length).toBe(6);
    });
});