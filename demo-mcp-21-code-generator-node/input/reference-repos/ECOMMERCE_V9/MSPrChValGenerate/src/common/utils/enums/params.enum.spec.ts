import { Echannel, EtypeDocument, FamilyParams, NameCollectionDataBase, TypeParams } from "./params.enum"


describe('Params catalog should have correct values', () => {
    it('EtypeDocument', () => {
      expect(EtypeDocument.CC).toBe("CC")
      expect(EtypeDocument.CE).toBe("CE")
    })

    it('Echannel', () => {
      expect(Echannel.EC9_B2C).toBe("EC9_B2C")
    })

    it('TypeParams', () => {
      expect(TypeParams.price).toBe("productOfferingPrices")
      expect(TypeParams.feature).toBe("characteristics")
    })

    it('FamilyParams', () => {
        expect(FamilyParams.equipment).toBe("Terminales")
        expect(FamilyParams.technology).toBe("Tecnologia")
        expect(FamilyParams.posPlaDat).toBe("PosPlaDat")
        expect(FamilyParams.posPlaMov).toBe("PosPlaMov")
        expect(FamilyParams.prePla).toBe("PrePla")
        expect(FamilyParams.prepagoCharacteristics).toBe("Prepago")
        expect(FamilyParams.postPagoCharacteristics).toBe("Pospago")
    })

    it('NameCollectionDataBase', () => {
        expect(NameCollectionDataBase.DATA_MOBILE_ATTRIBUTES).toBe("COLPRTPREPOATTRIBUTES")
        expect(NameCollectionDataBase.DATA_MOBILE_PRICES).toBe("COLPRTPREPOPRICES")
        expect(NameCollectionDataBase.DATA_HOME_ATTRIBUTES).toBe("COLPRTHOMEATTRIBUTES")
        expect(NameCollectionDataBase.DATA_HOME_PRICES).toBe("COLPRTHOMEPRICES")
    })

    it('total enums', () => {
        expect(Object.keys(EtypeDocument).length).toBe(2)
        expect(Object.keys(Echannel).length).toBe(1)
        expect(Object.keys(TypeParams).length).toBe(2)
        expect(Object.keys(FamilyParams).length).toBe(9)
        expect(Object.keys(NameCollectionDataBase).length).toBe(4)
    })
})