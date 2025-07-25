
import { Echannel, EtypeDocument } from '../enums/params.enum';


describe('EtypeDocument should have correct values', () => {

    it('CC should --> "CC"', () => {
        expect(EtypeDocument.CC).toBe('CC');
    });

    it('CE should be --> "CE"', () => {
        expect(EtypeDocument.CE).toBe('CE');
    })

    it('total eneums', () => {
        expect(Object.keys(EtypeDocument).length).toBe(2);
    });
});

describe('Echannel should have correct values', () => {

    it('EC9_B2C should --> "EC9_B2C"', () => {
        expect(Echannel.EC9_B2C).toBe("EC9_B2C");
    });

    it('total eneums', () => {
        expect(Object.keys(Echannel).length).toBe(1);
    });
});

