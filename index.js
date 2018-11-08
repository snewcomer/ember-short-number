'use strict';

const extract = require('@ember-intl/broccoli-cldr-data');
const mergeTrees = require('broccoli-merge-trees');
const path = require('path');
const fs = require('fs');

module.exports = {
  name: require('./package').name,

  treeForApp(tree) {
    let trees = [tree];

    let { env, project } = this.app;

    let configPath = path.dirname(project.configPath());
    configPath = path.join(configPath, 'environment.js');

    if (!path.isAbsolute(configPath)) {
      configPath = path.join(project.root, configPath);
    }

    let addonConfig = {};
    if (fs.existsSync(configPath)) {
      addonConfig = require(configPath)(env);
    }

    let config = addonConfig['ember-short-number'];
    let locales = typeof config === 'object' ? config['locales'] : null;

    if (tree) { //&& this.locales.length) {
      let cldrTree = extract(tree, {
        locales: locales,
        pluralRules: false,
        relativeFields: false,
        numberFields: true,
        destDir: 'cldrs-shorts',
        prelude: '/*jslint eqeq: true*/\n',
        moduleType: 'es6'
      });

      trees.push(cldrTree);
    }

    return mergeTrees(trees, { overwrite: true });
  }
};
