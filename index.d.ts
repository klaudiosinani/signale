/**
 * Type definitions for Signale
 */

export interface BadgeColorText { badge?: String; color?: String; text?: Array<String> | String; }
export interface TimesStart extends BadgeColorText { }
export interface TimesEnd extends BadgeColorText { time?: String; }
export interface Times { start?: TimesStart; end?: TimesEnd; }
export interface Types { badge?: String, color?: String; label?: String; }
export interface Stream { }
export interface Config { displayScope?: Boolean; displayBadge?: Boolean; displayDate?: Boolean; displayFilename?: Boolean; displayLabel?: Boolean; displayTimestamp?: Boolean; underlineLabel?: Boolean; underlineMessage?: Boolean; underlinePrefix?: Boolean; underlineSuffix?: Boolean; uppercaseLabel?: Boolean; }
export interface Options { times?: Times; types: Types; stream?: Stream; scope?: String; }
export interface CompleteArrgumentType { prefix?: String; message: String; suffix?: String; }

interface Constructor<T> { new(options?: Options): T;(options?: Options): T; prototype: T; }
export interface Signale { constructor: Constructor<this>; }

/**
 * Print error message
 * @param args It takes N number of arrguments of `String | Error` type
 */
export function error<T>(...args: (String | Error)[]): T;

/**
 * Print await message
 * @param args It takes N number of arrguments of `String` type
 */
export function await<T>(...args: String[]): T;

/**
 * Print complete message
 * @param args It takes a arrgument of CompleteArrgumentType type
 */
export function complete<T>(args: CompleteArrgumentType): T;

/**
 * Print debug message
 * @param args It takes N number of arrguments of `String` type
 */
export function debug<T>(...args: String[]): T;

/**
 * Print fatal (aka error) message
 * @param args It takes N number of arrguments of `String | Error` type
 */
export function fatal<T>(...args: (String | Error)[]): T;

/**
 * Print the message with fav icon
 * @param args It takes N number of arrguments of `String` type
 */
export function fav<T>(...args: String[]): T;

/**
 * Print the message with info icon
 * @param args It takes N number of arrguments of `String` type
 */
export function info<T>(...args: String[]): T;

/**
 * Print the message with note icon
 * @param args It takes N number of arrguments of `String` type
 */
export function note<T>(...args: String[]): T;

/**
 * Print the message with pause icon
 * @param args It takes N number of arrguments of `String` type
 */
export function pause<T>(...args: String[]): T;

/**
 * Print the message with pending icon
 * @param args It takes N number of arrguments of `String` type
 */
export function pending<T>(...args: String[]): T;

/**
 * Print the message with star (same as note) icon
 * @param args It takes N number of arrguments of `String` type
 */
export function star<T>(...args: String[]): T;

/**
 * Print the message with start icon
 * @param args It takes N number of arrguments of `String` type
 */
export function start<T>(...args: String[]): T;

/**
 * Print the message with success icon
 * @param args It takes N number of arrguments of `String` type
 */
export function success<T>(...args: String[]): T;

/**
 * Print the message with warning icon
 * @param args It takes N number of arrguments of `String` type
 */
export function warn<T>(...args: String[]): T;

/**
 * Print the message with watch icon
 * @param args It takes N number of arrguments of `String` type
 */
export function watch<T>(...args: String[]): T;

/** Clear the log */
export function log<T>(...args: String[]): T;

/**
 * Create custom scopped logger
 * @param args It takes N number of arrguments of `String` type
 */
export function scope<T>(...args: String[]): T;

/**
 * Start the time to
 * @param args It takes N number of arrguments of `String` type
 */
export function time<T>(...args: String[]): T;

declare module "signale" { export = Signale; }
declare module "Signale" { export = Signale; }
export default Signale;

