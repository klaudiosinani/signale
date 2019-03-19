import { Signale, SignaleConstructorOptions } from '../';

const optionsOverride: SignaleConstructorOptions = {
  types: {
    error: {
      badge: '!!',
      color: 'red',
      label: 'fatal error'
    },
    success: {
      badge: '++',
      color: 'green',
      label: 'huge success'
    }
  }
};

const signale = new Signale(optionsOverride);

signale.error('Default Error Log');
signale.success('Default Success Log');

const customOverride = new Signale(optionsOverride);

customOverride.error('Custom Error Log');
customOverride.success('Custom Success Log');
