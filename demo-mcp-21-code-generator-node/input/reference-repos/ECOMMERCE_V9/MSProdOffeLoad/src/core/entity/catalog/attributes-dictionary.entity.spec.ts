import { IAttributesDictionary } from "./attributes-dictionary.entity"

describe('IAttributesDictionary', () => {
  it('Should have properties IAttributesDictionary', () => {
    const test: IAttributesDictionary = {
      Identifier: "specificationSubtype",
      Type: "STRING",
      AttributeType: "AssignedValues",
      Sequence: "1",
      Displayable: "false",
      Comparable: "false",
      Facetable: "false",
      Searchable: "false",
      Name: "specificationSubtype",
      Delete: ""
    }

    expect(test).toHaveProperty('Identifier')
    expect(test).toHaveProperty('Type')
    expect(test).toHaveProperty('AttributeType')
    expect(test).toHaveProperty('Sequence')
    expect(test).toHaveProperty('Displayable')
    expect(test).toHaveProperty('Comparable')
    expect(test).toHaveProperty('Facetable')
    expect(test).toHaveProperty('Searchable')
    expect(test).toHaveProperty('Name')
    expect(test).toHaveProperty('Delete')
  })
})