import { MethodFeatures, MethodMessage } from '../enums/mapping-api-rest';

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

describe('Manual should have correct values', () => {
  it('MANUAL should be --> "manual"', () => {
    expect(MethodFeatures.MANUAL).toBe("/manual");
  });

  it('total enums', () => {
    expect(Object.keys(MethodFeatures).length).toBe(1);
  });
});

