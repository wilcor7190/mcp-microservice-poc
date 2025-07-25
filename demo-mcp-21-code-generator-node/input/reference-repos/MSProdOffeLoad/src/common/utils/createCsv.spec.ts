const path = require('path');
import fs = require('fs');
import find from '../../common/utils/UtilConfig';
import CreateCsv from './createCsv';

describe('CreateCsv', () => {
  const tempDir = path.join(__dirname, 'temp');

  beforeEach(() => {
    fs.mkdirSync(tempDir, { recursive: true });
  });

  afterEach(() => {
    fs.rmdirSync(tempDir, { recursive: true });
  });

  it('Should create file', async () => {
    find.getCsv = jest
      .fn()
      .mockReturnValue(path.resolve(`${tempDir}/test-file.csv`));
    const test = {
      _id: '645bbfc7739ec3ff88f07a40',
      PriceListUniqueId: '',
      PriceListName: 'PrecioSinImpuestos',
      CatentryPartNumber: 'PO_Tec7016853',
      CatentryUniqueId: '',
      Identifier: '',
      Precedence: '',
      StartDate: '',
      EndDate: '',
      LastUpdate: '',
      QuantityUnitIdentifier: '',
      MinimumQuantity: '',
      Description: '',
      PriceInCOP: '361261',
      PriceInCOPTax: '',
      PlazosSinImpuestos: '',
      PlazosConImpuestos: '',
      Field1: '',
      Field2: '',
      Delete: '',
    };

    jest.spyOn(CreateCsv, 'createCsv');
    await CreateCsv.createCsv(
      test,
      path.resolve(`${tempDir}/test-file.csv`),
      { id: 'PartNumber', title: 'PartNumber' },
      'test-file',
      'test-file',
    );

    expect(fs.existsSync(`${tempDir}/test-file.csv`)).toBe(true);
  });
});
