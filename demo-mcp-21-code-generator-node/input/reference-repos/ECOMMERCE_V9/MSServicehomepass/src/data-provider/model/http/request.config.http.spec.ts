import { EHttpMethod, IRequestConfigHttp } from './request-config-http.model';

describe('IParam', () => {
  it('should have properties IParam', () => {
    const param: IRequestConfigHttp = {
      method: EHttpMethod.post,
      url: '',
    };

    expect(param).toHaveProperty('method');
    expect(param).toHaveProperty('url');
  });
});
