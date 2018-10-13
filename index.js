'use strict';

const extract = require('broccoli-cldr-data');
const mergeTrees = require('broccoli-merge-trees');

module.exports = {
  name: require('./package').name,

  treeForApp(tree) {
    let trees = [tree];

    if (tree && this.locales.length) {
      let cldrTree = extract(tree, {
        numberFields: true,
        destDir: 'cldrs-short',
        prelude: '/*jslint eqeq: true*/\n',
        moduleType: 'es6'
      });

      trees.push(cldrTree);
    }

    return mergeTrees(trees, { overwrite: true });
  }
};
