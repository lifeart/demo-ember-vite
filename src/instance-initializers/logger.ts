import type ApplicationInstance from '@ember/application/instance';
import type { Logger } from '../initializer/logger';

export function initialize(applicationInstance: ApplicationInstance) {
  let logger = applicationInstance.lookup('logger:main') as Logger;

  logger.log('Instance initializer init');
}

export default {
  name: 'logger',
  initialize,
};
