'use strict';
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');
const pkgConf = require('pkg-conf');
const types = require('./types');
const pkg = require('./package.json');

let longestLabel = types.start.label.length;
const defaults = pkg.options.default;
const namespace = pkg.name;

const now = () => Date.now();
const timeSpan = then => {
  return (now() - then);
};

class Signale {
  constructor(options = {}) {
    this._config = Object.assign(this.packageConfiguration, options.config);
    this._customTypes = Object.assign({}, options.types);
    this._scopeName = options.scope || '';
    this._timers = options.timers || new Map();
    this._types = Object.assign(types, this._customTypes);

    Object.keys(this._types).forEach(type => {
      this[type] = this._logger.bind(this, type);
    });

    for (const type in this._types) {
      if (this._types[type].label && this._types[type].label.length > longestLabel) {
        longestLabel = this._types[type].label.length;
      }
    }
  }

  get scopeName() {
    return this._scopeName;
  }

  get currentOptions() {
    return Object.assign({}, {
      config: this._config,
      types: this._customTypes,
      timers: this._timers
    });
  }

  get dateStamp() {
    return new Date().toLocaleDateString();
  }

  get timeStamp() {
    return new Date().toLocaleTimeString();
  }

  get filename() {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, stack) => stack;
    const {stack} = new Error();
    Error.prepareStackTrace = _;

    const callers = stack.map(x => path.basename(x.getFileName()));

    return callers.find(x => {
      return x !== callers[0];
    });
  }

  get packageConfiguration() {
    return pkgConf.sync(namespace, {defaults});
  }

  set configuration(configObj) {
    this._config = Object.assign(this.packageConfiguration, configObj);
  }

  _logger(type, ...messageObj) {
    this._log(this._buildSignale(this._types[type], ...messageObj));
  }

  _log(message) {
    process.stdout.write(message + '\n');
  }

  _formatDateStamp() {
    return `[${this.dateStamp}]`;
  }

  _formatFilename() {
    return `[${this.filename}]`;
  }

  _formatScopeName() {
    if (Array.isArray(this._scopeName)) {
      const scopes = this._scopeName.filter(x => x.length !== 0);
      return `${scopes.map(x => `[${x.trim()}]`).join(' ')}`;
    }
    return `[${this._scopeName}]`;
  }

  _formatTimeStamp() {
    return `[${this.timeStamp}]`;
  }

  _meta() {
    const meta = [];
    if (this._config.displayDatestamp) {
      meta.push(this._formatDateStamp());
    }
    if (this._config.displayTimestamp) {
      meta.push(this._formatTimeStamp());
    }
    if (this._config.displayFilename) {
      meta.push(this._formatFilename());
    }
    if (this._scopeName.length !== 0 && this._config.displayScope) {
      meta.push(this._formatScopeName());
    }
    if (meta.length !== 0) {
      meta.push(`${figures.pointerSmall}`);
      return meta.map(item => chalk.grey(item));
    }
    return meta;
  }

  _buildSignale(type, ...args) {
    let [msg, additional] = [{}, {}];

    if (args.length === 1 && typeof (args[0]) === 'object' && args[0] !== null) {
      if (args[0] instanceof Error) {
        [msg] = args;
      } else {
        const [{prefix, message, suffix}] = args;
        msg = message;
        additional = Object.assign({}, {suffix, prefix});
      }
    } else {
      msg = args.join(' ');
    }

    const signale = this._meta();

    if (additional.prefix) {
      signale.push(additional.prefix);
    }

    if (this._config.displayBadge && type.badge) {
      signale.push(chalk[type.color](type.badge.padEnd(2)));
    }

    if (this._config.displayLabel && type.label) {
      if (this._config.underlineLabel) {
        signale.push(chalk[type.color].underline(type.label).padEnd(longestLabel + 20));
      } else {
        signale.push(chalk[type.color](type.label.padEnd(longestLabel + 1)));
      }
    }

    if (msg instanceof Error) {
      const [name, ...rest] = msg.stack.split('\n');
      signale.push(name);
      signale.push(chalk.grey(rest.map(l => l.replace(/^/, '\n')).join('')));
      return signale.join(' ');
    }

    if (this._config.underlineMessage) {
      signale.push(chalk.underline(msg.join(' ')));
    } else {
      signale.push(msg);
    }

    if (additional.suffix) {
      signale.push(additional.suffix);
    }

    return signale.join(' ');
  }

  config(configObj) {
    this.configuration = configObj;
  }

  scope(...name) {
    if (name.length === 0) {
      throw new Error('No scope name was defined.');
    }
    return new Signale(Object.assign(this.currentOptions, {scope: name}));
  }

  descope() {
    this._scopeName = '';
  }

  time(label) {
    if (!label) {
      label = `timer_${this._timers.size}`;
    }

    this._timers.set(label, Date.now());
    const message = this._meta();

    const report = [
      chalk.green(this._types.start.badge.padEnd(2)),
      chalk.green.underline(label).padEnd(longestLabel + 20),
      'Initialized timer...'
    ];

    message.push(...report);
    this._log(message.join(' '));
    return {label};
  }

  timeEnd(label) {
    if (!label && this._timers.size) {
      const is = x => x.includes('timer_');
      label = [...this._timers.keys()].reduceRight((x, y) => {
        return is(x) ? x : (is(y) ? y : null);
      });
    }
    if (this._timers.has(label)) {
      const span = timeSpan(this._timers.get(label));
      this._timers.delete(label);

      const message = this._meta();
      const report = [
        chalk.red(this._types.pause.badge.padEnd(2)),
        chalk.red.underline(label).padEnd(longestLabel + 20),
        'Timer run for:',
        chalk.yellow(span < 1000 ? span + 'ms' : (span / 1000).toFixed(2) + 's')
      ];

      message.push(...report);

      this._log(message.join(' '));
      return {label, span};
    }
  }
}

module.exports = Signale;
