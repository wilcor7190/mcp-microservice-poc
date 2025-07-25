import { postpaidFeaturesEnum, postpaidFeaturesIDEnum } from "./postpaidFeatures.enum"


describe('postpaidFeatures catalog should have correct values', () => {
    it('total enums', () => {
       expect(Object.keys(postpaidFeaturesEnum).length).toBe(19)
       expect(Object.keys(postpaidFeaturesIDEnum).length).toBe(15)
    })
})