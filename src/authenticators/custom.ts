import Base from 'ember-simple-auth/authenticators/base';

export default class CustomAuthenticator extends Base {
  restore(data) {
    return Promise.resolve(data);
  }

  authenticate() {
    return Promise.resolve({ id: 1, name: 'Santa Claus' });
  }

  invalidate() {
    return Promise.resolve();
  }
}
