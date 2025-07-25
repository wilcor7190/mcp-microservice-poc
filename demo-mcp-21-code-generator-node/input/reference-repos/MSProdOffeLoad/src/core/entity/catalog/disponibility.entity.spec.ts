import { IDisponibility } from "./disponibility.entity"

describe('IDisponibility', () => {
  it('Should have properties IDisponibility', () => {
    const test: IDisponibility = {
      parentPartNumber: "PO_Tec7017715",
      stockDisponibility: "1",
      partNumber: [
        {
          "sku" : "7017715",
          "description" : "SMRT WATCH S1 ACTIVE 1.43\" SPC BLCK XIAO"
        }
      ]
    }

    expect(test).toHaveProperty('parentPartNumber')
    expect(test).toHaveProperty('stockDisponibility')
    expect(test).toHaveProperty('partNumber')    
  })
})