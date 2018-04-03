#!/usr/bin/env node
if (require.main === module) {
  // eslint-disable-next-line global-require
  require('./cli');
}

module.exports = require('./generate');
