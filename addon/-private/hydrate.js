/* globals requirejs */

import { warn } from '@ember/debug';

/** @private **/
export function lookupByFactoryType(type, modulePrefix) {
  return Object.keys(requirejs.entries).filter(key => {
    return key.indexOf(`${modulePrefix}/${type}/`) === 0;
  });
}

/**
 * Peeks into the requirejs map and registers all locale data (CLDR & Translations) found.
 *
 * @private
 */
export default function(service, owner) {
  const config = owner.resolveRegistration('config:environment');
  const cldrs = lookupByFactoryType('cldrs-shorts', config.modulePrefix);

  if (!cldrs.length) {
    warn(
      '[ember-short-number] project is missing CLDR data',
      false,
      {
        id: 'ember-short-number-missing-cldr-data'
      }
    );
  }

  cldrs
    .map(moduleName => owner.resolveRegistration(`cldrs-short:${moduleName.split('/').pop()}`))
    .forEach(data => data.forEach(service.addLocaleData.bind(service)));
}
