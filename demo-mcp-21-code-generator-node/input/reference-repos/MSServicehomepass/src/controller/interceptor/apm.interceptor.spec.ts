import { ApmInterceptor } from './apm.interceptor';
import { ExecutionContext, CallHandler } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import * as APM from '@claro/general-utils-library';

jest.mock('@claro/general-utils-library', () => ({
  startTransaction: jest.fn(),
  captureError: jest.fn(),
}));

describe('ApmInterceptor', () => {
  let interceptor: ApmInterceptor;
  let context: ExecutionContext;
  let next: CallHandler;

  beforeEach(() => {
    interceptor = new ApmInterceptor();
    context = {
      getArgs: jest.fn().mockReturnValue([{ method: 'GET', url: '/test' }]),
    } as unknown as ExecutionContext;
    next = {
      handle: jest.fn().mockReturnValue(of('test')),
    } as unknown as CallHandler;
  });

  it('should start an APM transaction on successful request handling', (done) => {
    interceptor.intercept(context, next).subscribe(() => {
      expect(APM.startTransaction).toHaveBeenCalledWith('GET /test');
      done();
    });
  });

  it('should capture an error using APM and rethrow it if an error occurs during request handling', (done) => {
    const testError = new Error('Test error');
    next.handle = jest.fn().mockReturnValue(throwError(testError));

    interceptor.intercept(context, next).subscribe({
      next: () => {},
      error: (err) => {
        expect(APM.captureError).toHaveBeenCalledWith(testError);
        expect(err).toBe(testError);
        done();
      },
    });
  });
});
