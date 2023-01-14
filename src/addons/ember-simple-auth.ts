import SessionService from 'ember-simple-auth/addon/services/session';
import SessionStoresApplication from 'ember-simple-auth/app/session-stores/application';
import Adaptive from 'ember-simple-auth/session-stores/adaptive';
import LocalStorage from 'ember-simple-auth/session-stores/local-storage';
import Cookie from 'ember-simple-auth/session-stores/cookie';
import InternalSession from 'ember-simple-auth/internal-session';

const registry = {
  'session-store:adaptive': Adaptive,
  'session-store:cookie': Cookie,
  'session-store:local-storage': LocalStorage,
  'session:main': InternalSession,
  'session-store:application': SessionStoresApplication,
  'service:session': SessionService,
  'service:cookies': Cookie,
};

export default registry;
