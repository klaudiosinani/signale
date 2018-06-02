'use strict';
const Signale = require('./signale');
const Badge = require('node-emoji');

console.log(Badge);

module.exports = Object.assign(new Signale(), {Signale, Badge});
