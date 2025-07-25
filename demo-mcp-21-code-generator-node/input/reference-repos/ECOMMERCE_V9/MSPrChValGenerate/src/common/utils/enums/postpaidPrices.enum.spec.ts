import { postpaidPricesEnum } from "./postpaidPrices.enum"

describe('postpaidFeatures catalog should have correct values', () => {
    it('total enums', () => {
       expect(Object.keys(postpaidPricesEnum).length).toBe(6)
    })
})