import { MappingStatusCode } from '../configuration/mapping-statuscode';

describe('correct values StatusCode', () => {
  it('correct value status 200', () => {
      expect(MappingStatusCode.SUCCESS).toBe(200);
  });

  it('correct value status 201', () => {
      expect(MappingStatusCode.CREATED).toBe(201);
  });

  it('correct value status 201', () => {
      expect(MappingStatusCode.BAD_REQUEST).toBe(400);
  });

  it('total enums', () => {
      expect(Object.keys(MappingStatusCode).length).toBe(10);
  });
});


