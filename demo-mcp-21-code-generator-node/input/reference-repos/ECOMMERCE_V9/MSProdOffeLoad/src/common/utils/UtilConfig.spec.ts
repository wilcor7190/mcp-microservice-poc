const path = require("path")
import UtilConfig from "./UtilConfig"

describe('UtilConfig', () => {
  it('Should return path file', () => {
    expect(UtilConfig.getCsv('file-test')).toBe(path.resolve(`${__dirname}/file-test.csv`))
  })
})