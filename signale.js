'use strict';
const util = require('util');
const path = require('path');
const chalk = require('chalk');
const figures = require('figures');
const pkgConf = require('pkg-conf');
const pkg = require('./package.json');
const defaultTypes = require('./types');

let isPreviousLogInteractive = false;
const defaults = pkg.options.default;
const namespace = pkg.name;

const arrayify = x => {
  return Array.isArray(x) ? x : [x];
};
const now = () => Date.now();
const timeSpan = then => {
  return (now() - then);
};

class Signale {
  constructor(options = {}) {
    this._interactive = options.interactive || false;
    this._config = Object.assign(this.packageConfiguration, options.config);
    this._customTypes = Object.assign({}, options.types);
    this._scopeName = options.scope || '';
    this._timers = options.timers || new Map();
    this._types = this._mergeTypes(defaultTypes, this._customTypes);
    this._stream = options.stream || process.stdout;
    this._longestLabel = defaultTypes.start.label.length;

    Object.keys(this._types).forEach(type => {
      this[type] = this._logger.bind(this, type);
    });

    for (const type in this._types) {
      if (this._types[type].label && this._types[type].label.length > this._longestLabel) {
        this._longestLabel = this._types[type].label.length;
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
      interactive: this._interactive,
      timers: this._timers,
      stream: this._stream
    });
  }

  get date() {
    return new Date().toLocaleDateString();
  }

  get timestamp() {
    return new Date().toLocaleTimeString();
  }

  get filename() {
    const _ = Error.prepareStackTrace;
    Error.prepareStackTrace = (error, stack) => stack;
    const {stack} = new Error();
    Error.prepareStackTrace = _;

    const callers = stack.map(x => x.getFileName());

    const firstExternalFilePath = callers.find(x => {
      return x !== callers[0];
    });

    return firstExternalFilePath ? path.basename(firstExternalFilePath) : 'anonymous';
  }

  get packageConfiguration() {
    return pkgConf.sync(namespace, {defaults});
  }

  set configuration(configObj) {
    this._config = Object.assign(this.packageConfiguration, configObj);
  }

  _mergeTypes(standard, custom) {
    Object.keys(custom).forEach(type => {
      standard[type] = Object.assign({}, standard[type], custom[type]);
    });
    return standard;
  }

  _formatStream(stream) {
    return arrayify(stream);
  }

  _formatDate() {
    return `[${this.date}]`;
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

  _formatTimestamp() {
    return `[${this.timestamp}]`;
  }

  _formatMessage(str, type) {
    str = arrayify(str);

    if (this._config.coloredInterpolation) {
      const _ = Object.assign({}, util.inspect.styles);

      Object.keys(util.inspect.styles).forEach(x => {
        util.inspect.styles[x] = type.color || _[x];
      });

      str = util.formatWithOptions({colors: true}, ...str);
      util.inspect.styles = Object.assign({}, _);
      return str;
    }

    return util.format(...str);
  }

  _meta() {
    const meta = [];
    if (this._config.displayDate) {
      meta.push(this._formatDate());
    }
    if (this._config.displayTimestamp) {
      meta.push(this._formatTimestamp());
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

  _hasAdditional({suffix, prefix}, args, type) {
    return (suffix || prefix) ? '' : this._formatMessage(args, type);
  }

  _buildSignale(type, ...args) {
    let [msg, additional] = [{}, {}];

    if (args.length === 1 && typeof (args[0]) === 'object' && args[0] !== null) {
      if (args[0] instanceof Error) {
        [msg] = args;
      } else {
        const [{prefix, message, suffix}] = args;
        additional = Object.assign({}, {suffix, prefix});
        msg = message ? this._formatMessage(message, type) : this._hasAdditional(additional, args, type);
      }
    } else {
      msg = this._formatMessage(args, type);
    }

    const signale = this._meta();

    if (additional.prefix) {
      if (this._config.underlinePrefix) {
        signale.push(chalk.underline(additional.prefix));
      } else {
        signale.push(additional.prefix);
      }
    }

    if (this._config.displayBadge && type.badge) {
      signale.push(chalk[type.color](type.badge.padEnd(type.badge.length + 1)));
    }

    if (this._config.displayLabel && type.label) {
      const label = this._config.uppercaseLabel ? type.label.toUpperCase() : type.label;
      if (this._config.underlineLabel) {
        signale.push(chalk[type.color].underline(label).padEnd(this._longestLabel + 20));
      } else {
        signale.push(chalk[type.color](label.padEnd(this._longestLabel + 1)));
      }
    }

    if (msg instanceof Error && msg.stack) {
      const [name, ...rest] = msg.stack.split('\n');
      if (this._config.underlineMessage) {
        signale.push(chalk.underline(name));
      } else {
        signale.push(name);
      }
      signale.push(chalk.grey(rest.map(l => l.replace(/^/, '\n')).join('')));
      return signale.join(' ');
    }

    if (this._config.underlineMessage) {
      signale.push(chalk.underline(msg));
    } else {
      signale.push(msg);
    }

    if (additional.suffix) {
      if (this._config.underlineSuffix) {
        signale.push(chalk.underline(additional.suffix));
      } else {
        signale.push(additional.suffix);
      }
    }

    return signale.join(' ');
  }

  _write(stream, message) {
    if (this._interactive && isPreviousLogInteractive) {
      stream.moveCursor(0, -1);
      stream.clearLine();
      stream.cursorTo(0);
    }
    stream.write(message + '\n');
    isPreviousLogInteractive = this._interactive;
  }

  _log(message, streams = this._stream) {
    this._formatStream(streams).forEach(stream => {
      this._write(stream, message);
    });
  }

  _logger(type, ...messageObj) {
    this._log(this._buildSignale(this._types[type], ...messageObj), this._types[type].stream);
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

  unscope() {
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
      chalk.green.underline(label).padEnd(this._longestLabel + 20),
      'Initialized timer...'
    ];

    message.push(...report);
    this._log(message.join(' '));
    return label;
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
        chalk.red.underline(label).padEnd(this._longestLabel + 20),
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
