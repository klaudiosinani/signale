/**
 * Type definitions for Signale
 */

export interface TimesStart {
    badge?: String;
    color?: String;
    text?: String;
}

export interface TimesEnd {
    badge?: String;
    color?: String;
    text?: Array<String>;
    time?: String;
}

export interface Times {
    start?: TimesStart;
    end?: TimesEnd;
}

export interface CustomTypesProps {
    badge?: String;
    color?: String;
    label?: String;
}

export interface CustomTypes {
    'custom-type'?: CustomTypesProps,
}

export interface Config {
    displayScope?: Boolean;
    displayBadge?: Boolean;
    displayDate?: Boolean;
    displayFilename?: Boolean;
    displayLabel?: Boolean;
    displayTimestamp?: Boolean;
    underlineLabel?: Boolean;
    underlineMessage?: Boolean;
    underlinePrefix?: Boolean;
    underlineSuffix?: Boolean;
    uppercaseLabel?: Boolean;
}

export interface SignaleOptions {
    times?: Times;
    types: CustomTypes;
    // stream?: Stream;
    scope?: String;
}

export interface SignaleConstructor {
    new(options?: SignaleOptions): Signale;
    (options?: SignaleOptions): Signale;
}

export interface Signale {
    constructor: SignaleConstructor;
    error(n: any): this;
    await(): this;
    complete(): this;
    error(): this;
    debug(): this;
    fatal(): this;
    fav(): this;
    info(): this;
    note(): this;
    pause(): this;
    pending(): this;
    star(): this;
    start(): this;
    success(n: any): this;
    warn(): this;
    watch(): this;
    log(): this;

    time(): this;
    timeEnd(): this;
    scope(n: String): this;
    unscope(): this;
    config(config: Config): this;
}

declare const signale: Signale;

export default signale;