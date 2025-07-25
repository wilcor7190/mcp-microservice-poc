import { prepaidPricesEnum } from "./prepaidPrices.enum"

describe('PrePaidPrices catalog should have correct lenght', () => {
    it('total enums', () => {
       expect(Object.keys(prepaidPricesEnum).length).toBe(6)
    })
})