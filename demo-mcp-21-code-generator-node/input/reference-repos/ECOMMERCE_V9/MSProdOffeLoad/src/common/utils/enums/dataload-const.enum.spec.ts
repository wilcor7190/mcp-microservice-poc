import { USAGE_FULLIMAGE, USAGE_THUMBNAIL } from "./dataload-const.enum"

describe('Const dataload should have correct values', () => {
  it('Const dataload', () => {
    expect(USAGE_THUMBNAIL).toBe("ANGLEIMAGES_THUMBNAIL")
    expect(USAGE_FULLIMAGE).toBe("ANGLEIMAGES_FULLIMAGE")
  })
})
