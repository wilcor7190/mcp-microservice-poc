import { EhomesAttributesPrices, EHomesCharacteristics, EHomesPrices } from "./homesAttributesPrices.enum"

describe('PostPaidPrices catalog should have correct lenght', () => {
    it('total enums', () => {
       expect(Object.keys(EhomesAttributesPrices).length).toBe(5)
       expect(Object.keys(EHomesCharacteristics).length).toBe(103)
       expect(Object.keys(EHomesPrices).length).toBe(3)
    })
})