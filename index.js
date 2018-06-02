'use strict';
const Badge = require('node-emoji');
const Signale = require('./signale');

module.exports = Object.assign(new Signale(), {Signale, Badge});
