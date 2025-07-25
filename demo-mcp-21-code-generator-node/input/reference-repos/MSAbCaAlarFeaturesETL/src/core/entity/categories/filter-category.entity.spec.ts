import { IFilterCategorie } from "./filter-category.entity"

describe('IFilterCategorie', () => {
  it('Should have properties IFilterCategorie', () => {
    const test: IFilterCategorie = {
      family: "terminales",
      type: "characteristics"
    }

    expect(test).toHaveProperty('family')
    expect(test).toHaveProperty('type')
  })
})