export {
  className,
  attribute,
  classNames,
  classNameBindings,
  attributeBindings,
  tagName,
} from '@ember-decorators/component';

// noop
export const layout = () => (target) => {
  return target;
};
