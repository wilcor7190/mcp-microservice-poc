import { IrequestInfo } from "./response-http.model";

describe('IrequestInfo', () => {
  it('should have properties IrequestInfo', () => {
    const param: IrequestInfo = {
      url:"",
      source:"",
      method:"",
      headers: {},
      params: "",
      data: "",
      timeout: ""
    }

    expect(param).toHaveProperty('method')
    expect(param).toHaveProperty('url')
    expect(param).toHaveProperty('source')
    expect(param).toHaveProperty('headers')
    expect(param).toHaveProperty('params')
    expect(param).toHaveProperty('data')
    expect(param).toHaveProperty('timeout')
  })
})
