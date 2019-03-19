import * as signale from '../';

signale.time('test1');
signale.time('test2');
signale.time();
signale.time();

setTimeout(() => {
  signale.timeEnd();
  signale.timeEnd();
  signale.timeEnd('test2');
  signale.timeEnd('test1');
}, 500);
