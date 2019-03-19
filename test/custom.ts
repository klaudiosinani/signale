import { Signale, SignaleConstructorOptions } from '../';

type CustomLogger = 'remind' | 'santa';

const optionsCustom: SignaleConstructorOptions<CustomLogger> = {
  stream: process.stdout,
  scope: 'custom',
  types: {
    remind: {
      badge: '**',
      color: 'yellow',
      label: 'reminder'
    },
    santa: {
      badge: '🎅',
      color: 'red',
      label: 'santa'
    }
  }
};

const custom = new Signale(optionsCustom);

custom.remind('Improve documentation.');
custom.santa('Hoho! You have an unused variable on L45.');
custom.debug('This should still work');

