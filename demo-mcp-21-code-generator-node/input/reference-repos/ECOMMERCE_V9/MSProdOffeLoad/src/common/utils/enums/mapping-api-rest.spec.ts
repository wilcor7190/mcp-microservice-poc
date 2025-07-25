import { DataLoad, MethodMessage } from '../enums/mapping-api-rest';

describe('MethodMessage should have correct values', () => {
  it('GETBYID should "GETBYID"', () => {
    expect(MethodMessage.GETBYID).toBe(":Id");
  });

  it('GETALL should be --> "GETALL"', () => {
    expect(MethodMessage.GETALL).toBe("/");
  })

  it('UPDATE should be --> "UPDATE"', () => {
    expect(MethodMessage.UPDATE).toBe(":Id");
  })
  it('total eneums', () => {
    expect(Object.keys(MethodMessage).length).toBe(3);
  });
});

describe('DataLoad should have correct values', () => {
  it('DATALOAD_MANUAL should be --> "dataload"', () => {
    expect(DataLoad.DATALOAD_MANUAL).toBe("/dataload");
  });

  it('total enums', () => {
    expect(Object.keys(DataLoad).length).toBe(1);
  });
});

