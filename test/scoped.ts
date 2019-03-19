import { Signale, SignaleConstructorOptions } from '../';

const optionsScope: SignaleConstructorOptions = {
  scope: 'global1 scope'
};

const global1 = new Signale(optionsScope);
global1.success('Successful Operation');

const global2 = global1.scope('global2 scope');
global2.success('Hello from the global2 scope');

function scopedTest() {
  const outer = global2.scope('outer', 'scope');
  outer.success('Hello from the outer scope');

  setTimeout(() => {
    const inner = outer.scope('inner', 'scope');
    inner.success('Hello from the inner scope');
  }, 500);
}

scopedTest();
