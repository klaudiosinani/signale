'use strict';
const figures = require('figures');

module.exports = {
  error: {
    badge: figures.cross,
    color: 'red',
    label: 'error',
    logLevel: 'error'
  },
  fatal: {
    badge: figures.cross,
    color: 'red',
    label: 'fatal',
    logLevel: 'error'
  },
  fav: {
    badge: figures('❤'),
    color: 'magenta',
    label: 'favorite',
    logLevel: 'debug'
  },
  info: {
    badge: figures.info,
    color: 'blue',
    label: 'info',
    logLevel: 'info'
  },
  star: {
    badge: figures.star,
    color: 'yellow',
    label: 'star',
    logLevel: 'debug'
  },
  success: {
    badge: figures.tick,
    color: 'green',
    label: 'success',
    logLevel: 'info'
  },
  wait: {
    badge: figures.ellipsis,
    color: 'blue',
    label: 'waiting',
    logLevel: 'debug'
  },
  warn: {
    badge: figures.warning,
    color: 'yellow',
    label: 'warning',
    logLevel: 'warn'
  },
  complete: {
    badge: figures.checkboxOn,
    color: 'cyan',
    label: 'complete',
    logLevel: 'debug'
  },
  pending: {
    badge: figures.checkboxOff,
    color: 'magenta',
    label: 'pending',
    logLevel: 'debug'
  },
  note: {
    badge: figures.bullet,
    color: 'blue',
    label: 'note',
    logLevel: 'debug'
  },
  start: {
    badge: figures.play,
    color: 'green',
    label: 'start',
    logLevel: 'debug'
  },
  pause: {
    badge: figures.squareSmallFilled,
    color: 'yellow',
    label: 'pause',
    logLevel: 'debug'
  },
  debug: {
    badge: figures('⬤'),
    color: 'red',
    label: 'debug',
    logLevel: 'debug'
  },
  await: {
    badge: figures.ellipsis,
    color: 'blue',
    label: 'awaiting',
    logLevel: 'debug'
  },
  watch: {
    badge: figures.ellipsis,
    color: 'yellow',
    label: 'watching',
    logLevel: 'debug'
  },
  log: {
    badge: '',
    color: '',
    label: '',
    logLevel: 'debug'
  }
};
