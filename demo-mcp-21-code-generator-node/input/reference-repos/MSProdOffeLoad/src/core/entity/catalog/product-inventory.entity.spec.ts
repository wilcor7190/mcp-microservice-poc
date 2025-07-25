import { IProductInventory } from "./product-inventory.entity"

describe('IProductInventory', () => {
  it('Should have properties IProductInventory', () => {
    const test: IProductInventory = {
      PartNumber: "PO_Equ70010932",
      FulfillmentCenterName: "Extended Sites Catalog Asset Store Home",
      Quantity: "1",
      QuantityMeasure: "C62",
      Delete: "0"
    }

    expect(test).toHaveProperty('PartNumber')
    expect(test).toHaveProperty('FulfillmentCenterName')
    expect(test).toHaveProperty('Quantity')
    expect(test).toHaveProperty('QuantityMeasure')
    expect(test).toHaveProperty('Delete')    
  })
})