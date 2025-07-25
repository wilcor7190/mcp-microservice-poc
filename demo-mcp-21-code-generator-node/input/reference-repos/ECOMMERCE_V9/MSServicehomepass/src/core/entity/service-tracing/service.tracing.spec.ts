import { IServiceTracing } from './service-tracing.entity';

describe('AvaliabilityEntity', () => {
  it('should have properties IParam', () => {
    const param: IServiceTracing = {
      status: '',
      origen: '',
      task: '',
      description: '',
    };

    expect(param).toHaveProperty('status');
    expect(param).toHaveProperty('origen');
    expect(param).toHaveProperty('task');
    expect(param).toHaveProperty('description');
  });
});
