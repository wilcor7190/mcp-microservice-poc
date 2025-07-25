import { ISalesCatalog } from "./sales-catalog.entity"

describe('ISalesCatalog', () => {
  it('Should have properties ISalesCatalog', () => {
    const test: ISalesCatalog = {
      PartNumber: "PO_Equ70033359P",
      Sequence: "1",
      ParentGroupIdentifier: "CELULARESTL",
      Delete: "0"
    }

    expect(test).toHaveProperty('PartNumber')
    expect(test).toHaveProperty('Sequence')
    expect(test).toHaveProperty('ParentGroupIdentifier')
    expect(test).toHaveProperty('Delete')    
  })
})