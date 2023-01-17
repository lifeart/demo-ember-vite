import Ember from 'ember';

export default Ember;

// @ts-expect-error - Ember._tracked is not exported
const tracked = Ember['_tracked'];

export { tracked };
