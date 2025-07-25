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

  it('correct value status 201', () => {
    expect(MappingStatusCode.NOT_FOUND).toBe(404);
  });

  it('correct value status 201', () => {
    expect(MappingStatusCode.INTERNAL_SERVER_ERROR).toBe(500);
  });

});


