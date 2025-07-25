import { Etask, EDescriptionTracingGeneral } from "./taks.enum"

describe('task catalog should have correct lenght', () => {
    it('total enums', () => {
       expect(Object.keys(Etask).length).toBe(93)
       expect(Object.keys(EDescriptionTracingGeneral).length).toBe(3)
    })
})