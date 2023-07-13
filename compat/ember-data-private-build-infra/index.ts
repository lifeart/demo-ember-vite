import { DEPRECATIONS } from './deprecations';
import { DEBUGGING } from './debugging';
/* eslint-disable no-var */
export var HAS_DEBUG_PACKAGE = true;
export var HAS_MODEL_PACKAGE = true;
export var HAS_RECORD_DATA_PACKAGE = true;
export var HAS_JSON_API_PACKAGE = true;
export var HAS_GRAPH_PACKAGE = true;

export function generateDefineConfig(isProd: boolean) {
  const prefix = 'getOwnConfig()';
  const debug = !isProd;
  const config = getDataConfig(debug);
  const items = {
    [`${prefix}.env.DEBUG`]: debug,
    [`${prefix}.polyfillUUID`]: config.polyfillUUID,
  };
  Object.keys(config.packages).forEach((key) => {
    items[`${prefix}.packages.${key}`] = config.packages[key];
  });
  Object.keys(config.deprecations).forEach((key) => {
    items[`${prefix}.deprecations.${key}`] = isProd
      ? false
      : config.deprecations[key];
  });
  Object.keys(config.debug).forEach((key) => {
    items[`${prefix}.debug.${key}`] = isProd ? false : config.debug[key];
  });
  return items;
}

export function getDataConfig(debug: boolean) {
  return {
    packages: {
      HAS_GRAPH_PACKAGE,
      HAS_RECORD_DATA_PACKAGE,
      HAS_JSON_API_PACKAGE,
      HAS_MODEL_PACKAGE,
      HAS_DEBUG_PACKAGE,
    },
    polyfillUUID: false,
    debug: DEBUGGING,
    deprecations: DEPRECATIONS,
    env: {
      DEBUG: debug,
    },
  };
}
