/* Authors: Resi Respati <https://github.com/resir014>
 *          Kingdaro <https://github.com/kingdaro>
 *          Joydip Roy <https://github.com/rjoydip>
 *          Klaus Sinani <https://github.com/klaussinani>
 */

import {Writable as WritableStream} from 'stream';

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
    | 'warn'
    | 'watch';

  export type LoggerFunction = (...message: any[]) => void;

  export interface LoggerConfiguration {
    badge: string;
    color: string;
    label: string;
  }

  export interface InstanceConfiguration {
    displayBadge?: boolean;
    displayDate?: boolean;
    displayFilename?: boolean;
    displayLabel?: boolean;
    displayScope?: boolean;
    displayTimestamp?: boolean;
    underlineLabel?: boolean;
    underlineMessage?: boolean;
    underlinePrefix?: boolean;
    underlineSuffix?: boolean;
    uppercaseLabel?: boolean;
  }

  export interface ConstructorOptions<T extends string> {
    config?: InstanceConfiguration;
    disabled?: boolean;
    interactive?: boolean;
    scope?: string;
    stream?: WritableStream | WritableStream[];
    types?: Partial<Record<T, LoggerConfiguration>>;
  }

  export interface Constructor {
    new <T extends string = DefaultLogger>(
      options?: ConstructorOptions<T>
    ): Instance<T>;
  }

  interface Base<T extends string = DefaultLogger> {
    config(configObj: InstanceConfiguration): Instance<T>;
    scope(...name: string[]): Instance<T>;
    unscope(): void;
    time(label?: string): string;
    timeEnd(label?: string): { label: string; span: number };
  }

  export type Instance<T extends string = DefaultLogger> = Base<T> &
    Record<T, LoggerFunction> &
    Record<DefaultLogger, LoggerFunction>;
}

declare namespace signale {
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
