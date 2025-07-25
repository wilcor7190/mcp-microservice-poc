import { MappingApiRest } from "./mapping-api-rest";

describe('MappingApiRest enum', () => {
  test('should have the correct values', () => {
    expect(MappingApiRest.DB).toBe('db');
  });
});