import { characteristicsDuplicates, prepagoCharacteristics } from "./movHom.enum"

describe('PostPaidPrices catalog should have correct lenght', () => {
    it('total enums', () => {
       expect(Object.keys(characteristicsDuplicates).length).toBe(71)
    })
})