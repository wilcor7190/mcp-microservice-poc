import { IAttributesProduct } from "./attributes-product.entity"

describe('IAttributesProduct', () => {
  it('Should have properties IAttributesProduct', () => {
    const test: IAttributesProduct = {
      PartNumber: "PO_Equ70033359P",
      AttributeIdentifier: "specificationSubtype",
      ValueIdentifier: "PO_Equ70033359P",
      Value: "Telefono",
      Usage: "Descriptive",
      Sequence: "1",
      AttributeStoreIdentifier: "",
      AttributeValueDescriptionField1: "",
      AttributeValueDescriptionField2: "",
      AttributeValueDescriptionField3: "",
      AttributeValueDescriptionImage1: "",
      AttributeValueDescriptionImage2: "",
      AttributeValueField1: "",
      AttributeValueField2: "",
      AttributeValueField3: "",
      Field1: "",
      Field2: "",
      Field3: "",
      UnitOfMeasure: "",
      Delete: "0"
    }

    expect(test).toHaveProperty('PartNumber')
    expect(test).toHaveProperty('AttributeIdentifier')
    expect(test).toHaveProperty('ValueIdentifier')
    expect(test).toHaveProperty('Value')
    expect(test).toHaveProperty('Usage')
    expect(test).toHaveProperty('Sequence')
    expect(test).toHaveProperty('AttributeStoreIdentifier')
    expect(test).toHaveProperty('AttributeValueDescriptionField1')
    expect(test).toHaveProperty('AttributeValueDescriptionField2')
    expect(test).toHaveProperty('AttributeValueDescriptionField3')
    expect(test).toHaveProperty('AttributeValueDescriptionImage1')
    expect(test).toHaveProperty('AttributeValueDescriptionImage2')
    expect(test).toHaveProperty('AttributeValueField1')
    expect(test).toHaveProperty('AttributeValueField2')
    expect(test).toHaveProperty('AttributeValueField3')
    expect(test).toHaveProperty('Field1')
    expect(test).toHaveProperty('Field2')
    expect(test).toHaveProperty('Field3')
    expect(test).toHaveProperty('UnitOfMeasure')
    expect(test).toHaveProperty('Delete')
  })
})