import Base from 'ember-simple-auth/authenticators/base';

interface IUserData {
  id: string;
  name: string;
}

export default class CustomAuthenticator extends Base {
  restore(data: IUserData): Promise<IUserData> {
    return Promise.resolve(data);
  }

  authenticate(): Promise<IUserData> {
    return Promise.resolve({ id: '1', name: 'Santa Claus' });
  }

  invalidate() {
    return Promise.resolve();
  }
}
