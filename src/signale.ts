import util from 'util'
import path from 'path'
import readline from 'readline'
import chalk from 'chalk'
import figures from 'figures'
import pkgConf from 'pkg-conf'
import defaultTypes from './logger-types'
import { defaultOptions } from './options'

import { Writable as WritableStream } from 'stream'

import {
  ConstructorOptions,
  DefaultLogTypes, InstanceConfiguration,
  LoggerConfiguration, LoggerFunction,
  LoggerTypesConf,
  LogLevel, ScopeFormatter, Secrets
} from './types'

import CallSite = NodeJS.CallSite;
import WriteStream = NodeJS.WriteStream;

const defaultLogLevels = {
  debug: 0,
  info: 1,
  timer: 2,
  warn: 3,
  error: 4
}

const {green, grey, red, underline, yellow} = chalk

let isPreviousLogInteractive = false
const defaults = defaultOptions
const namespace = 'signales'

export interface AdditionalFormatObj {
  suffix?: string,
  prefix?: string,
}

export interface TimeEndResult {
  label: string,
  span: number,
}

function defaultScopeFormatter(scopes: string[]): string {
  return `[${scopes.join('::')}]`
}

function barsScopeFormatter(scopes: string[]): string {
  return scopes.map(scope => `[${scope}]`).join(' ')
}

class SignaleImpl<T extends string = DefaultLogTypes> {
  _interactive: boolean
  _config: InstanceConfiguration
  _customTypes: Partial<LoggerTypesConf<T>>
  _customLogLevels: Record<string, number>
  _logLevels: Record<string, number>
  _disabled: boolean
  _scopeName: string | string[]
  _timers: Map<string, number>
  _seqTimers: Array<string>
  _types: LoggerTypesConf<DefaultLogTypes | T>
  _stream: WritableStream | WritableStream[]
  _longestLabel: string
  _secrets: Secrets
  _scopeFormatter: ScopeFormatter
  _generalLogLevel: string

  static barsScopeFormatter: ScopeFormatter = barsScopeFormatter

  constructor(options: ConstructorOptions<T> = {}) {
    this._interactive = options.interactive || false
    this._config = Object.assign(this.packageConfiguration, options.config)
    this._customTypes = Object.assign({}, options.types)
    this._customLogLevels = Object.assign({}, options.logLevels)
    this._logLevels = Object.assign({}, defaultLogLevels, this._customLogLevels)
    this._disabled = options.disabled || false
    this._scopeName = options.scope || ''
    this._scopeFormatter = options.scopeFormatter || defaultScopeFormatter
    this._timers = new Map()
    this._seqTimers = []
    this._types = this._mergeTypes(defaultTypes, this._customTypes)
    this._stream = options.stream || process.stderr
    this._longestLabel = this._getLongestLabel()
    this._secrets = options.secrets || []
    this._generalLogLevel = this._validateLogLevel(options.logLevel)

    Object.keys(this._types).forEach(type => {
      // @ts-ignore
      this[type] = this._logger.bind(this, type)
    })
  }

  get _now(): number {
    return Date.now()
  }

  get scopePath(): string[] {
    return this._arrayify(this._scopeName).filter(x => x.length !== 0)
  }

  get currentOptions(): Omit<Required<ConstructorOptions<T>>, 'scope'> {
    return {
      config: this._config,
      disabled: this._disabled,
      types: this._customTypes,
      interactive: this._interactive,
      stream: this._stream,
      scopeFormatter: this._scopeFormatter,
      secrets: this._secrets,
      logLevels: this._customLogLevels,
      logLevel: this._generalLogLevel
    }
  }

  get date(): string {
    const _ = new Date()
    return [_.getFullYear(), _.getMonth() + 1, _.getDate()].join('-')
  }

  get timestamp(): string {
    const _ = new Date()
    return [_.getHours(), _.getMinutes(), _.getSeconds()].join(':')
  }

  get filename(): string {
    const _ = Error.prepareStackTrace
    Error.prepareStackTrace = (_error, stack) => stack
    const stack = new Error().stack as unknown as CallSite[]
    Error.prepareStackTrace = _

    const callers = stack.map(x => x.getFileName())

    const firstExternalFilePath = callers.find(x => {
      return x !== callers[0]
    })

    return firstExternalFilePath ? path.basename(firstExternalFilePath) : 'anonymous'
  }

  get packageConfiguration() {
    // @ts-ignore
    return pkgConf.sync(namespace, {defaults})
  }

  get _longestUnderlinedLabel(): string {
    return underline(this._longestLabel)
  }

  set configuration(configObj: InstanceConfiguration) {
    this._config = Object.assign(this.packageConfiguration, configObj)
  }

  _arrayify<T>(x: T): T extends any[] ? T: T[] {
    // @ts-ignore
    return Array.isArray(x) ? x : [x]
  }

  _timeSpan(then: number): number {
    return (this._now - then)
  }

  _getLongestLabel(): string {
    const {_types} = this
    const labels = Object.keys(_types).map(x => _types[x as T].label)
    return labels.reduce((x, y) => x.length > y.length ? x : y)
  }

  _validateLogLevel(level: LogLevel | string | undefined): string {
    return level && Object.keys(this._logLevels).includes(level) ? level : 'debug'
  }

  _mergeTypes(standard: LoggerTypesConf<DefaultLogTypes>, custom: Partial<LoggerTypesConf<T>>): LoggerTypesConf<T | DefaultLogTypes> {
    const types: LoggerTypesConf<T | DefaultLogTypes> = Object.assign({}, standard) as LoggerTypesConf<T | DefaultLogTypes>

    Object.keys(custom).forEach(type => {
      types[type as T] = Object.assign({}, types[type as T], custom[type as T])
    })

    return types
  }

  _filterSecrets(message: string): string {
    const {_secrets} = this

    if (_secrets.length === 0) {
      return message
    }

    let safeMessage = message

    _secrets.forEach(secret => {
      safeMessage = safeMessage.replace(new RegExp(String(secret), 'g'), '[secure]')
    })

    return safeMessage
  }

  _formatStream(stream: WritableStream | WritableStream[]): WritableStream[] {
    return this._arrayify(stream)
  }

  _formatDate(): string {
    return `[${this.date}]`
  }

  _formatFilename(): string {
    return `[${this.filename}]`
  }

  _formatScopeName(): string {
    return this._scopeFormatter(this.scopePath)
  }

  _formatTimestamp(): string {
    return `[${this.timestamp}]`
  }

  _formatMessage(str: any[] | string): string {
    // @ts-ignore todo: fix type
    return util.format(...this._arrayify(str))
  }

  _meta(): string[] {
    const meta = []

    if (this._config.displayDate) {
      meta.push(this._formatDate())
    }

    if (this._config.displayTimestamp) {
      meta.push(this._formatTimestamp())
    }

    if (this._config.displayFilename) {
      meta.push(this._formatFilename())
    }

    if (this.scopePath.length !== 0 && this._config.displayScope) {
      meta.push(this._formatScopeName())
    }

    if (meta.length !== 0) {
      meta.push(`${figures.pointerSmall}`)
      return meta.map(item => grey(item))
    }

    return meta
  }

  _hasAdditional({suffix, prefix}: AdditionalFormatObj, args: any[]): string {
    return (suffix || prefix) ? '' : this._formatMessage(args)
  }

  _buildSignale(type: LoggerConfiguration, ...args: any[]): string {
    let msg
    let additional: AdditionalFormatObj = {}

    if (args.length === 1 && typeof (args[0]) === 'object' && args[0] !== null) {
      if (args[0] instanceof Error) {
        [msg] = args
      } else {
        const [{prefix, message, suffix}] = args
        additional = Object.assign({}, {suffix, prefix})
        msg = message ? this._formatMessage(message) : this._hasAdditional(additional, args)
      }
    } else {
      msg = this._formatMessage(args)
    }

    const signale = this._meta()

    if (additional.prefix) {
      if (this._config.underlinePrefix) {
        signale.push(underline(additional.prefix))
      } else {
        signale.push(additional.prefix)
      }
    }

    const colorize = type.color ? chalk[type.color] : (x: any) => x

    if (this._config.displayBadge && type.badge) {
      signale.push(colorize(this._padEnd(type.badge, type.badge.length + 1)))
    }

    if (this._config.displayLabel && type.label) {
      const label = this._config.uppercaseLabel ? type.label.toUpperCase() : type.label
      if (this._config.underlineLabel) {
        signale.push(colorize(this._padEnd(underline(label), this._longestUnderlinedLabel.length + 1)))
      } else {
        signale.push(colorize(this._padEnd(label, this._longestLabel.length + 1)))
      }
    }

    if (msg instanceof Error && msg.stack) {
      const [name, ...rest] = msg.stack.split('\n')
      if (this._config.underlineMessage) {
        signale.push(underline(name))
      } else {
        signale.push(name)
      }

      signale.push(grey(rest.map(l => l.replace(/^/, '\n')).join('')))
      return signale.join(' ')
    }

    if (this._config.underlineMessage) {
      signale.push(underline(msg))
    } else {
      signale.push(msg)
    }

    if (additional.suffix) {
      if (this._config.underlineSuffix) {
        signale.push(underline(additional.suffix))
      } else {
        signale.push(additional.suffix)
      }
    }

    return signale.join(' ')
  }

  _write(stream: WritableStream | WriteStream, message: string) {
    const isTTY: boolean = (stream as WriteStream).isTTY || false
    if (this._interactive && isTTY && isPreviousLogInteractive) {
      readline.moveCursor(stream, 0, -1)
      readline.clearLine(stream, 0)
      readline.cursorTo(stream, 0)
    }

    stream.write(message + '\n')
    isPreviousLogInteractive = this._interactive
  }

  _log(message: string, streams: WritableStream | WritableStream[] = this._stream, logLevel: string) {
    if (this.isEnabled() && this._logLevels[logLevel] >= this._logLevels[this._generalLogLevel]) {
      this._formatStream(streams).forEach(stream => {
        this._write(stream, message)
      })
    }
  }

  _logger(type: T, ...messageObj: any[]) {
    const {stream, logLevel} = this._types[type]
    const message = this._buildSignale(this._types[type], ...messageObj)
    this._log(this._filterSecrets(message), stream, this._validateLogLevel(logLevel))
  }

  _padEnd(str: string, targetLength: number): string {
    str = String(str)

    if (str.length >= targetLength) {
      return str
    }

    return str.padEnd(targetLength)
  }

  addSecrets(secrets: Secrets): void {
    if (!Array.isArray(secrets)) {
      throw new TypeError('Argument must be an array.')
    }

    this._secrets.push(...secrets)
  }

  clearSecrets(): void {
    this._secrets = []
  }

  config(configObj: InstanceConfiguration): void {
    this.configuration = configObj
  }

  disable(): void {
    this._disabled = true
  }

  enable(): void {
    this._disabled = false
  }

  isEnabled(): boolean {
    return !this._disabled
  }

  clone<N extends string = T, R extends SignaleType<N> = SignaleType<N>>(options: ConstructorOptions<N>): R {
    const SignaleConstructor = (this.constructor || SignaleImpl) as unknown as new (options: ConstructorOptions<N>) => R
    const newInstance = new SignaleConstructor(Object.assign(this.currentOptions, options))
    newInstance._timers = new Map(this._timers.entries())
    newInstance._seqTimers = [...this._seqTimers]

    return newInstance
  }

  scope<R extends SignaleType<T> = SignaleType<T>>(...name: string[]): R {
    if (name.length === 0) {
      throw new Error('No scope name was defined.')
    }

    return this.clone({
      scope: name,
    })
  }

  child<R extends SignaleType<T> = SignaleType<T>>(name: string): R {
    const newScope = this.scopePath.concat(name)

    return this.scope<R>(...newScope)
  }

  unscope(): void {
    this._scopeName = ''
  }

  time(label?: string): string {
    if (!label) {
      label = `timer_${this._timers.size}`
      this._seqTimers.push(label)
    }

    this._timers.set(label, this._now)

    const message = this._meta()
    message.push(green(this._padEnd(this._types.start.badge, 2)))

    if (this._config.underlineLabel) {
      message.push(green(this._padEnd(underline(label), this._longestUnderlinedLabel.length + 1)))
    } else {
      message.push(green(this._padEnd(label, this._longestLabel.length + 1)))
    }

    message.push('Initialized timer...')
    this._log(message.join(' '), this._stream, 'timer')

    return label
  }

  timeEnd(label?: string): TimeEndResult | undefined {
    if (!label && this._seqTimers.length) {
      label = this._seqTimers.pop()
    }

    if (label && this._timers.has(label)) {
      const span = this._timeSpan(this._timers.get(label)!)
      this._timers.delete(label)

      const message = this._meta()
      message.push(red(this._padEnd(this._types.pause.badge, 2)))

      if (this._config.underlineLabel) {
        message.push(red(this._padEnd(underline(label), this._longestUnderlinedLabel.length + 1)))
      } else {
        message.push(red(this._padEnd(label, this._longestLabel.length + 1)))
      }

      message.push('Timer run for:')
      message.push(yellow(span < 1000 ? span + 'ms' : (span / 1000).toFixed(2) + 's'))
      this._log(message.join(' '), this._stream, 'timer')

      return { label, span }
    }
  }
}

export type SignaleType<T extends string = DefaultLogTypes> = Record<T, LoggerFunction> &
  Record<DefaultLogTypes, LoggerFunction> & SignaleImpl<T> & (new <T extends string = DefaultLogTypes>(options?: ConstructorOptions<T>) => SignaleType<T>)

export type SignaleConstructor<T extends string = DefaultLogTypes> = new (options?: ConstructorOptions<T>) => SignaleType<T>

export default SignaleImpl as unknown as SignaleType
