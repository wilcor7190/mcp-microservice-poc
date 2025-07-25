import { IFeaturesToMapping, IMappingFeature } from "./category.entity"

describe('IMappingFeature', () => {
  it('Should have properties IMappingFeature', () => {
    const test: IMappingFeature = {
      features : [
        {
          "id" : "specificationSubtype",
          "name" : "specificationSubtype",
          "value" : "Telefono"
        },
        {
          "id" : "MEMORIA_INTERNA",
          "name" : "MEMORIA INTERNA",
          "value" : "NA"
        }
      ],
      id : "PO_Equ70048459",
      partNumber : "PO_Equ70048459",
      name : null,
      description : "SIRIUM JM VL03 NA",
      fullImage : "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/646x1000/70048459.jpg",
      thumbnail : "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/200x310/na-na-na.jpg",
      URLKeyword: null
    }

    expect(test).toHaveProperty('partNumber')
    expect(test).toHaveProperty('name')
    expect(test).toHaveProperty('id')
    expect(test).toHaveProperty('description')
    expect(test).toHaveProperty('features')
    expect(test).toHaveProperty('fullImage')
    expect(test).toHaveProperty('thumbnail')
  })

  it('Should have properties IFeaturesToMapping', () => {
    const test: IFeaturesToMapping = {
      id : "specificationSubtype",
      name : "specificationSubtype",
      value : "Telefono"
    }

    expect(test).toHaveProperty('id')
    expect(test).toHaveProperty('name')
    expect(test).toHaveProperty('value')
  })
})