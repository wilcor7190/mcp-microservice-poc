import { EFamily, ETypeParams } from "./categories.enum"

describe('Categories catalog should have correct values', () => {
  it('EFamily', () => {
    expect(EFamily.EQUIPMENT).toBe("Terminales")
    expect(EFamily.TECHNOLOGY).toBe("Tecnologia")
    expect(EFamily.PREPAGO).toBe("Prepago")
    expect(EFamily.POSPAGO).toBe("Pospago")
    expect(EFamily.HOME).toBe("Hogares")
  })

  it('ETypeParams', () => {
    expect(ETypeParams.PRICES).toBe("productOfferingPrices")
    expect(ETypeParams.FEATURES).toBe("characteristics")    
  })
 
  it('total enums', () => {
    expect(Object.keys(EFamily).length).toBe(5)
    expect(Object.keys(ETypeParams).length).toBe(2)
  })
})
