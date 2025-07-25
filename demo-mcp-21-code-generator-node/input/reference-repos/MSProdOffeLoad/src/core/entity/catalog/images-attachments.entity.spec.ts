import { IImagesAttachments } from "./images-attachments.entity"

describe('IImagesAttachments', () => {
  it('Should have properties IImagesAttachments', () => {
    const test: IImagesAttachments = {
      accessTime: 123,
      group: 123,
      longname: "",
      modifyTime: 123,
      name: "",
      owner: 123,
      size: 123,
      type: "",
      rights: {
        user: "",
        group: "",
        other: ""
      }
    }

    expect(test).toHaveProperty('accessTime')
    expect(test).toHaveProperty('group')
    expect(test).toHaveProperty('longname')
    expect(test).toHaveProperty('modifyTime')
    expect(test).toHaveProperty('name')
    expect(test).toHaveProperty('owner')
    expect(test).toHaveProperty('size')
    expect(test).toHaveProperty('type')
    expect(test).toHaveProperty('rights')    
  })
})