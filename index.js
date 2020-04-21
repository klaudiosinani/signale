'use strict';
const Signale = require('./src/signale');

module.exports = Object.assign(new Signale(), {
  Signale,
  Signales: Signale, // alias for new package name
});
