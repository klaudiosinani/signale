/* Authors: Resi Respati <https://github.com/resir014>
 *          Kingdaro <https://github.com/kingdaro>
 *          Joydip Roy <https://github.com/rjoydip>
 *          Klaus Sinani <https://github.com/klaussinani>
 *          Andrey Rublev <https://github.com/anru>
 */

import { Writable as WritableStream } from 'stream'
import { Color } from 'chalk'

export type DefaultLogTypes =
  | 'await'
  | 'complete'
  | 'debug'
  | 'error'
  | 'fatal'
  | 'alert'
  | 'fav'
  | 'info'
  | 'log'
  | 'note'
  | 'pause'
  | 'pending'
  | 'star'
  | 'start'
  | 'success'
  | 'wait'
  | 'warn'
  | 'watch'

export type ChalkColor = typeof Color
export type Secrets = (string | number)[]

export type LoggerFunction = (...message: any[]) => void

export type LogLevel = 'info' | 'timer' | 'debug' | 'warn' | 'error'

export interface LoggerConfiguration {
  badge: string,
  color: ChalkColor | '',
  label: string,
  logLevel?: LogLevel,
  stream?: WritableStream | WritableStream[],
}

export type LoggerTypesConf<T extends string> = Record<T, LoggerConfiguration>

export interface InstanceConfiguration {
  displayBadge?: boolean,
  displayDate?: boolean,
  displayFilename?: boolean,
  displayLabel?: boolean,
  displayScope?: boolean,
  displayTimestamp?: boolean,
  underlineLabel?: boolean,
  underlineMessage?: boolean,
  underlinePrefix?: boolean,
  underlineSuffix?: boolean,
  uppercaseLabel?: boolean,
}

export type ScopeFormatter = (scopePath: string[]) => string

export interface ConstructorOptions<T extends string> {
  config?: InstanceConfiguration,
  disabled?: boolean,
  interactive?: boolean,
  logLevel?: LogLevel | string,
  logLevels?: Record<string, number>,
  scope?: string | string[],
  scopeFormatter?: ScopeFormatter,
  secrets?: Secrets,
  stream?: WritableStream | WritableStream[],
  types?: Partial<LoggerTypesConf<T>>,
}
