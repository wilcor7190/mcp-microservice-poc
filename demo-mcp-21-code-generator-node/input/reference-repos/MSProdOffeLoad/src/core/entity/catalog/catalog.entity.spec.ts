import { ICatalog } from "./catalog.entity"

describe('ICatalog', () => {
  it('Should have properties ICatalog', () => {
    const test: ICatalog = {
      id: "PO_Equ70048459",
      description: "SIRIUM JM VL03 NA",
      partNumber: "PO_Equ70048459",
      name: "",
      fullImage: "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/646x1000/70048459.jpg",
      thumbnail: "https://cdn.demoqafront.claro.com.co/imagenes/v9/catalogo/200x310/na-na-na.jpg",
      URLKeyword: "",
      features: [
        {
          "id" : "specificationSubtype",
          "name" : "specificationSubtype",
          "value" : "Telefono"
        }
      ]
    }

    expect(test).toHaveProperty('id')
    expect(test).toHaveProperty('description')
    expect(test).toHaveProperty('partNumber')
    expect(test).toHaveProperty('name')
    expect(test).toHaveProperty('fullImage')
    expect(test).toHaveProperty('thumbnail')
    expect(test).toHaveProperty('features')    
  })
})