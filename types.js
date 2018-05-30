'use strict';
const figures = require('figures');

module.exports = {
  error: {
    badge: figures.cross,
    color: 'red',
    label: 'error'
  },
  fatal: {
    badge: figures.cross,
    color: 'red',
    label: 'fatal'
  },
  fav: {
    badge: figures('❤'),
    color: 'magenta',
    label: 'favorite'
  },
  info: {
    badge: figures.info,
    color: 'blue',
    label: 'info'
  },
  star: {
    badge: figures.star,
    color: 'yellow',
    label: 'star'
  },
  success: {
    badge: figures.tick,
    color: 'green',
    label: 'success'
  },
  warn: {
    badge: figures.warning,
    color: 'yellow',
    label: 'warning'
  },
  complete: {
    badge: figures.checkboxOn,
    color: 'cyan',
    label: 'complete'
  },
  pending: {
    badge: figures.checkboxOff,
    color: 'magenta',
    label: 'pending'
  },
  note: {
    badge: figures.bullet,
    color: 'blue',
    label: 'note'
  },
  start: {
    badge: figures.play,
    color: 'green',
    label: 'start'
  },
  pause: {
    badge: figures.squareSmallFilled,
    color: 'yellow',
    label: 'pause'
  },
  debug: {
    badge: figures('⬤'),
    color: 'red',
    label: 'debug'
  },
  await: {
    badge: figures.ellipsis,
    color: 'blue',
    label: 'awaiting'
  },
  watch: {
    badge: figures.ellipsis,
    color: 'yellow',
    label: 'watching'
  },
  log: {
    badge: '',
    color: '',
    label: ''
  }
};
