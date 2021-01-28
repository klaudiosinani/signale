import { Signale, SignaleConstructorOptions } from '..';

const opts: SignaleConstructorOptions = {
  stream: process.stderr, // All loggers will now write to `process.stderr`
  types: {
    error: {
      badge: '✖',
      color: 'red',
      label: 'error',
      // Only `error` will write to both `process.stdout` & `process.stderr`
      stream: [process.stdout, process.stderr]
    }
  }
};

const signale = new Signale(opts);

signale.success('Message will appear on `process.stderr`');
signale.error('Message will appear on both `process.stdout` & `process.stderr`');
