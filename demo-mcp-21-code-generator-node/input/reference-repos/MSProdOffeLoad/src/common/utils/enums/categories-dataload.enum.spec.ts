import { ECategoriesDataload } from "./categories-dataload.enum"

describe('Categories catalog should have correct values', () => {
  it('ECategoriesDataload', () => {
    expect(ECategoriesDataload.EQUIPMENT).toBe("Terminales")
    expect(ECategoriesDataload.TECHNOLOGY).toBe("Tecnologia")
    expect(ECategoriesDataload.PREPAGO).toBe("Prepago")
    expect(ECategoriesDataload.POSPAGO).toBe("Pospago")
    expect(ECategoriesDataload.HOMES).toBe("Hogares")
  })

  it('total enums', () => {
    expect(Object.keys(ECategoriesDataload).length).toBe(5)
  })
})
