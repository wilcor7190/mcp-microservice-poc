import { EmessageMapping } from "./message.enum"


it('DisponibiltyStatus', () => {
    expect(EmessageMapping.CHANNEL_ERROR).toBe("CHANNEL_ERROR")
    expect(EmessageMapping.DEFAULT).toBe("DEFAULT")
    expect(EmessageMapping.DEFAULT_ERROR).toBe("DEFAULT_ERROR") 
  })