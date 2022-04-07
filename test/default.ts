import * as logger1 from '..';

const { Signale } = logger1;

logger1.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: true,
  displayLine: true,
  timeZone: "America/Argentina/Buenos_Aires",
  formatDate: "DD-MM-YYYY",
  formatTime: "HH:mm:ss a"
});

logger1.success('Operation successful');
logger1.debug('Hello', 'from', 'L59');
logger1.pending('Write release notes for %s', '1.2.0');
logger1.fatal(new Error('Unable to acquire lock'));
logger1.watch('Recursively watching build directory...');
logger1.complete({
  prefix: '[task]',
  message: 'Fix issue #59',
  suffix: '(@klaussinani)'
});

const logger2 = new Signale();

logger2.success('Operation successful');
logger2.debug('Hello', 'from', 'L59');
logger2.pending('Write release notes for %s', '1.2.0');
logger2.fatal(new Error('Unable to acquire lock'));
logger2.watch('Recursively watching build directory...');
logger2.complete({
  prefix: '[task]',
  message: 'Fix issue #59',
  suffix: '(@klaussinani)'
});
