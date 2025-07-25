import { IPriceList } from "./price-list.entity"

describe('IPriceList', () => {
  it('Should have properties IPriceList', () => {
    const test: IPriceList = {
      PriceListUniqueId: "",
      PriceListName: "Extended Sites Catalog Asset StoreList",
      CatentryUniqueId: "",
      CatentryPartNumber: "PO_Equ70010932P",
      PriceInCOP: "0",
      Delete: "",
      Identifier: "",
      Precedence: "",
      StartDate: "",
      EndDate: "",
      LastUpdate: "",
      QuantityUnitIdentifier: "",
      MinimumQuantity: "",
      Description: "",
      PriceInCOPTax: "",
      PlazosSinImpuestos: "",
      PlazosConImpuestos: "",
      Field1: "",
      Field2: ""
    }

    expect(test).toHaveProperty('PriceListUniqueId')
    expect(test).toHaveProperty('PriceListName')
    expect(test).toHaveProperty('CatentryUniqueId')
    expect(test).toHaveProperty('CatentryPartNumber')
    expect(test).toHaveProperty('PriceInCOP')
    expect(test).toHaveProperty('Delete')
    expect(test).toHaveProperty('Identifier')
    expect(test).toHaveProperty('Precedence')
    expect(test).toHaveProperty('StartDate')
    expect(test).toHaveProperty('EndDate')
    expect(test).toHaveProperty('LastUpdate')
    expect(test).toHaveProperty('QuantityUnitIdentifier')
    expect(test).toHaveProperty('MinimumQuantity')
    expect(test).toHaveProperty('Description')
    expect(test).toHaveProperty('PriceInCOPTax')
    expect(test).toHaveProperty('PlazosSinImpuestos')
    expect(test).toHaveProperty('PlazosConImpuestos')
    expect(test).toHaveProperty('Field1')
    expect(test).toHaveProperty('Field2')    
  })
})