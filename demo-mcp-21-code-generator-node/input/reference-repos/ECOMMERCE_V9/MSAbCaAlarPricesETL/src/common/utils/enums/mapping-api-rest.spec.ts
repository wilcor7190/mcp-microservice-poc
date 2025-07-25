
import { MethodMessage } from '../enums/mapping-api-rest';

describe('MethodMessage should have correct values', () => {

  it('GETBYID should "GETBYID" --> R ', () => {
    expect(MethodMessage.GETBYID).toBe(":Id");
  });

  it('GETALL should be --> "GETALL"', () => {
    expect(MethodMessage.GETALL).toBe("/");
  })

  it('total eneums', () => {
    expect(Object.keys(MethodMessage).length).toBe(3);
  });
});

