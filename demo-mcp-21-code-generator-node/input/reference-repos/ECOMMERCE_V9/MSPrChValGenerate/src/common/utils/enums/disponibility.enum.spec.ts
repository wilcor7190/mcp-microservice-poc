import { DisponibiltyEnum } from "./disponibility.enum"

 
describe('disponibility catalog should have correct values', () => {
    it('DisponibiltyEnum', () => {
      expect(DisponibiltyEnum.PO_TECHNOLOGY).toBe("PO_Tec")
      expect(DisponibiltyEnum.PO_EQUIMENT).toBe("PO_Equ")
    })
  
})