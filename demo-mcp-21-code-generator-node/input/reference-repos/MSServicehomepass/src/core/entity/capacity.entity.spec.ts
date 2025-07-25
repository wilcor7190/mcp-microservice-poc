import { ICapacity } from './capacity.entity';

describe('IMessage', () => {
  it('should have properties id, description and message', () => {
    const capacity: ICapacity = {
      isMigratedUser: false,
      transactionId: 'aaaa',
      system: 'string',
      user: 'corredorw',
      password: 'string',
      requestDate: 'string',
      ipApplication: 'string',
      orderId: 'string',
      documentId: 'string',
      addressId: 'string',
      apptNumber: 'string',
      dateList: undefined,
      locationList: undefined,
    };

    expect(capacity).toHaveProperty('isMigratedUser');
    expect(capacity).toHaveProperty('transactionId');
    expect(capacity).toHaveProperty('system');
    expect(capacity).toHaveProperty('user');
    expect(capacity).toHaveProperty('password');
    expect(capacity).toHaveProperty('requestDate');
    expect(capacity).toHaveProperty('ipApplication');
    expect(capacity).toHaveProperty('orderId');
    expect(capacity).toHaveProperty('documentId');
    expect(capacity).toHaveProperty('addressId');
    expect(capacity).toHaveProperty('apptNumber');
  });
});
