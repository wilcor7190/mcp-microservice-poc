import { IAttachmentsData } from "./attachments-data.entity"

describe('IAttachmentsData', () => {
  it('Should have properties IAttachmentsData', () => {
    const test: IAttachmentsData = {
      AssetPath: "",
      AssetUrl: "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/646x1000/70024373.jpg",
      Delete: "0",
      LanguageId: "-1",
      LongDescription: "Iphone 7 Plus 32 GB Dorado",
      Name: "APPLEIPHONE7PLUS32 GB",
      PartNumber: "PO_Equ70024373",
      Sequence: "1",
      ShortDescription: "Iphone 7 Plus 32 GB Dorado",
      Usage: "ANGLEIMAGES_FULLIMAGE"
    }

    expect(test).toHaveProperty('AssetPath')
    expect(test).toHaveProperty('AssetUrl')
    expect(test).toHaveProperty('Delete')
    expect(test).toHaveProperty('LanguageId')
    expect(test).toHaveProperty('LongDescription')
    expect(test).toHaveProperty('Name')
    expect(test).toHaveProperty('PartNumber')
    expect(test).toHaveProperty('Sequence')
    expect(test).toHaveProperty('ShortDescription')
    expect(test).toHaveProperty('Usage')    
  })
})