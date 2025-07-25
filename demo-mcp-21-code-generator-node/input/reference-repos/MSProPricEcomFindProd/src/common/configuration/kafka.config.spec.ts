import * as kafkaConfig from './kafka.config'

describe('Servives should have correct values', () => {
  it('correct value groupId', () => {
    expect(kafkaConfig.default.groupId).toBeDefined();
  });
  
})