/* Authors: Resi Respati <https://github.com/resir014>
 *          Kingdaro <https://github.com/kingdaro>
 *          Joydip Roy <https://github.com/rjoydip>
 *          Klaus Sinani <https://github.com/klaussinani>
 */

import { Writable as WritableStream } from 'stream';

declare namespace _signale {
  export type DefaultLogger =
    | 'await'
    | 'complete'
    | 'debug'
    | 'error'
    | 'fatal'
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
    | 'watch';

  export type ChalkColor =
    | 'black'
    | 'blue'
    | 'blueBright'
    | 'cyan'
    | 'cyanBright'
    | 'gray'
    | 'green'
    | 'greenBright'
    | 'magenta'
    | 'magentaBright'
    | 'red'
    | 'redBright'
    | 'white'
    | 'whiteBright'
    | 'yellow'
    | 'yellowBright';

  export type Secret = (string | number)[];

  export type LoggerFunction = (...message: any[]) => void;

  export type LogLevel = 'info' | 'timer' | 'debug' | 'warn' | 'error';

  export interface LoggerConfiguration {
    badge: string;
    color: ChalkColor;
    label: string;
    logLevel?: LogLevel;
    stream?: WritableStream | WritableStream[];
  }

  export interface InstanceConfiguration {
    displayBadge?: boolean;
    displayDate?: boolean;
    displayFilename?: boolean;
    displayLine?: boolean;
    displayLabel?: boolean;
    displayScope?: boolean;
    displayTimestamp?: boolean;
    underlineLabel?: boolean;
    underlineMessage?: boolean;
    underlinePrefix?: boolean;
    underlineSuffix?: boolean;
    uppercaseLabel?: boolean;
    timeZone?: string;
    formatDate?: string;
    formatTime?: string;
  }

  export interface ConstructorOptions<T extends string> {
    config?: InstanceConfiguration;
    disabled?: boolean;
    interactive?: boolean;
    logLevel?: LogLevel;
    scope?: string;
    secrets?: Secret;
    stream?: WritableStream | WritableStream[];
    types?: Partial<Record<T, LoggerConfiguration>>;
  }

  export interface Constructor {
    new <T extends string = DefaultLogger>(
      options?: ConstructorOptions<T>
    ): Instance<T>;
  }

  interface Base<T extends string = DefaultLogger> {
    addSecrets(secrets: Secret): void;
    clearSecrets(): void;
    config(configObj: InstanceConfiguration): Instance<T>;
    disable(): void;
    enable(): void;
    isEnabled(): boolean;
    scope(...name: string[]): Instance<T>;
    time(label?: string): string;
    timeEnd(label?: string): { label: string; span: number };
    unscope(): void;
  }

  export type Instance<T extends string = DefaultLogger> = Base<T> &
    Record<T, LoggerFunction> &
    Record<DefaultLogger, LoggerFunction>;
}

declare namespace signale {
  export type Secret = _signale.Secret;
  export type LogLevel = _signale.LogLevel;
  export type ChalkColor = _signale.ChalkColor;
  export type DefaultLogger = _signale.DefaultLogger;
  export type LoggerFunction = _signale.LoggerFunction;
  export interface SignaleConfiguration
    extends _signale.InstanceConfiguration {}
  export interface LoggerConfiguration extends _signale.LoggerConfiguration {}
  export interface SignaleConstructorOptions<T extends string = DefaultLogger>
    extends _signale.ConstructorOptions<T> {}
}

declare const signale: _signale.Instance & {
  Signale: _signale.Constructor;
};

export = signale;
