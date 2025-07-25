import { prepaidFeaturesEnum, prepaidFeaturesEnumID } from "./prepaidFeatures.enum"

describe('PostPaidPrices catalog should have correct lenght', () => {
    it('total enums', () => {
       expect(Object.keys(prepaidFeaturesEnum).length).toBe(19)
       expect(Object.keys(prepaidFeaturesEnumID).length).toBe(15)
    })
})