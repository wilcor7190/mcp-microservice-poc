import { IProductData } from "./product-data.entity"

describe('IProductData', () => {
  it('Should have properties IProductData', () => {
    const test: IProductData = {
      PartNumber: "PO_Equ70033359P",
      ParentPartNumber: "",
      ParentGroupIdentifier: "CELULARES",
      ParentStoreIdentifier: "",
      Type: "Product",
      Name: "NA",
      ShortDescription: "NA",
      LongDescription: "NA",
      Thumbnail: "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/200x310/na-na-na.jpg",
      FullImage: "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/646x1000/70033359.jpg",
      Available: "1",
      Published: "1",
      Buyable: "1",
      Delete: "0",
      AvailabilityDate_LocalSpecific: "",
      EndDate: "",
      Field1: "",
      Field2: "",
      Field3: "",
      Field4: "",
      Field5: "",
      URLKeyword: "",
      ManufacturerPartNumber: "",
      OnSpecial: "",
      StartDate: "",
      Manufacturer: ""
    }

    expect(test).toHaveProperty('PartNumber')
    expect(test).toHaveProperty('ParentPartNumber')
    expect(test).toHaveProperty('ParentGroupIdentifier')
    expect(test).toHaveProperty('ParentStoreIdentifier')
    expect(test).toHaveProperty('Type')
    expect(test).toHaveProperty('Name')
    expect(test).toHaveProperty('ShortDescription')
    expect(test).toHaveProperty('LongDescription')
    expect(test).toHaveProperty('Thumbnail')
    expect(test).toHaveProperty('FullImage')
    expect(test).toHaveProperty('Available')
    expect(test).toHaveProperty('Published')
    expect(test).toHaveProperty('Buyable')
    expect(test).toHaveProperty('Delete')
    expect(test).toHaveProperty('AvailabilityDate_LocalSpecific')
    expect(test).toHaveProperty('EndDate')
    expect(test).toHaveProperty('Field1')
    expect(test).toHaveProperty('Field2')
    expect(test).toHaveProperty('Field3')
    expect(test).toHaveProperty('Field4')
    expect(test).toHaveProperty('Field5')
    expect(test).toHaveProperty('ManufacturerPartNumber')
    expect(test).toHaveProperty('OnSpecial')
    expect(test).toHaveProperty('StartDate')
    expect(test).toHaveProperty('Manufacturer')    
  })
})