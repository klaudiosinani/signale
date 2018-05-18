<h1 align="center">
  Signale
</h1>

<h4 align="center">
  👋 Hackable console logger
</h4>

<div align="center">
  <img alt="Header" src="https://cdn.rawgit.com/klauscfhq/signale/2d8bcff8/media/header.png" width="88%">
</div>

<p align="center">
  <a href="https://travis-ci.org/klauscfhq/signale">
    <img alt="Build Status" src="https://travis-ci.com/klauscfhq/signale.svg?branch=master">
  </a>
</p>

## Description

Hackable and configurable to the core, signale can be used for logging purposes, status reporting, as well as for handling the output rendering process of other node modules and applications.

Come over to [Gitter](https://gitter.im/klauscfhq/signale) or [Twitter](https://twitter.com/klauscfhq) to share your thoughts on the project.

## Highlights

- 15 out-of-the-box loggers
- Hackable to the core
- Clean and beautiful output
- Integrated timers
- Custom pluggable loggers
- Filename, date and timestamp support
- Scoped loggers and timers
- Simple and minimal syntax
- Globally configurable through `package.json`
- Overridable configuration per file and logger

## Contents

- [Description](#description)
- [Highlights](#highlights)
- [Install](#install)
- [Usage](#usage)
- [Configuration](#configuration)
- [API](#api)
- [Development](#development)
- [License](#license)

## Install

```bash
npm install signale
```

## Usage

### Default Loggers

Import signale and start using any of the default loggers.

<details>
<summary>View all of the available loggers.</summary>

<br/>

- `await`
- `complete`
- `error`
- `debug`
- `fatal`
- `fav`
- `info`
- `note`
- `pause`
- `pending`
- `star`
- `start`
- `success`
- `warn`
- `watch`

</details>

<br/>

```js
const signale = require('signale');

signale.success('Operation successful');
signale.debug('Hello', 'from', 'L59');
signale.pending('Write release notes for 1.2.0');
signale.fatal(new Error('Unable to acquire lock'));
signale.watch('Recursively watching build directory...');
signale.complete({prefix: '[task]', message: 'Fix issue #59', suffix: '(@klauscfhq)'});
```

<div align="center">
  <img alt="Default Loggers" src="media/default-loggers.png" width="65%">
</div>

### Custom Loggers

To create a custom logger define an `options` object yielding a `types` field with the logger data and pass it as argument to a new signale instance.

```js
const {Signale} = require('signale');

const options = {
  scope: 'custom',
  types: {
    remind: {
      badge: '**',
      color: 'yellow',
      label: 'reminder'
    },
    santa: {
      badge: '🎅',
      color: 'red',
      label: 'santa'
    }
  }
};

const custom = new Signale(options);
custom.remind('Improve documentation.');
custom.santa('Hoho! You have an unused variable on L45.');
```

<div align="center">
  <img alt="Custom Loggers" src="media/custom-loggers.png" width="70%">
</div>

Additionally, all default loggers can be overridden to your own preference.

Here is an example where we override the default `error` and `success` loggers.

```js
const {Signale} = require('signale');

const options = {
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

const signale = new Signale();
signale.error('Default Error Log');
signale.success('Default Success Log');

const custom = new Signale(options);
custom.error('Custom Error Log');
custom.success('Custom Success Log');
```

<div align="center">
  <img alt="Default Loggers" src="media/override-defaults.png" width="65%">
</div>

The `options` object can hold the `scope` and `types` attributes, where the first corresponds to the name of the scope the logger is reporting from and the second is where the objects named after the custom loggers reside.

##### `scope`

- Type: `String`

Name of the scope.

##### `types`

- Type: `Object`

Holds the configuration of the custom and default loggers.

##### `badge`

- Type: `String`

The icon corresponding to the logger.

##### `label`

- Type: `String`

The label used to identify the type of the logger.

##### `color`

- Type: `String`

The color of the label, can be any of the foreground colors supported by [chalk](https://github.com/chalk/chalk#colors).

### Scoped Loggers

To create a scoped logger from scratch, define the `scope` field inside the `options` object and pass it as argument to a new signale instance.

```js
const {Signale} = require('signale');

const options = {
  scope: 'global scope'
};

const global = new Signale(options);
global.success('Successful Operation');
```

<div align="center">
  <img alt="Scope Vanilla" src="media/scope-vanilla.png" width="65%">
</div>

To create a scoped logger based on an already existing one, use the `scope()` function, which will return a new signale instance, inheriting all custom loggers, timers and configuration from the initial one.

```js
const signale = require('signale');

const global = signale.scope('global scope');
global.success('Hello from the global scope');

function foo() {
  const outer = global.scope('outer', 'scope');
  outer.success('Hello from the outer scope');
  
  setTimeout(() => {
    const inner = outer.scope('inner', 'scope'); 
    inner.success('Hello from the inner scope');
  }, 500);
}

foo();
```

<div align="center">
  <img alt="Scope Existing" src="media/scope-existing.png" width="65%">
</div>

### Timers

Timer are managed by the `time()` and `timeEnd()` functions. A unique label can be used to identify a timer on initialization, though if none is provided the timer will be assigned one automatically. In addition, calling the `timeEnd()` function without a specified label will have as effect the termination of the most recently initialized timer, that was created without providing a label.

```js
const signale = require('signale');

signale.time('test');
signale.time();
signale.time();

setTimeout(() => {
  signale.timeEnd();
  signale.timeEnd();
  signale.timeEnd('test');
}, 500);
```

<div align="center">
  <img alt="Timers" src="media/timers.png" width="60%">
</div>

## Configuration

### Global

To enable global configuration define the options under the `signale` namespace in your `package.json`.

The following illustrates all the available options with their respective default values.

```json
{
  "signale": {
    "displayScope": true,
    "displayBadge": true,
    "displayDate": false,
    "displayFilename": false,
    "displayLabel": true,
    "displayTimestamp": false,
    "underlineLabel": true,
    "underlineMessage": false
  }
}
```

<details>
<summary>View all of the available options in detail.</summary>

##### `displayScope`

- Type: `Boolean`
- Default: `true`

Display the scope name of the logger. 

##### `displayBadge`

- Type: `Boolean`
- Default: `true`

Display the badge of the logger.

##### `displayDate`

- Type: `Boolean`
- Default: `false`

Display the current local date in `YY-MM-DD` format. 

##### `displayFilename`

- Type: `Boolean`
- Default: `false`

Display the name of the file that the logger is reporting from.

##### `displayLabel`

- Type: `Boolean`
- Default: `true`

Display the label of the logger.

##### `displayTimestamp`

- Type: `Boolean`
- Default: `false`

Display the current local time in `HH:MM:SS` format.

##### `underlineLabel`

- Type: `Boolean`
- Default: `true`

Underline the logger label.

##### `underlineMessage`

- Type: `Boolean`
- Default: `false`

Underline the logger message.

</details>

### Local

To enable local configuration call the `config()` function on your signale instance. Local configurations will always override any pre-existing configuration inherited from `package.json`.

In the following example, loggers in the `foo.js` file will run under their own configuration, overriding the `package.json` one.

```js
// foo.js
const signale = require('signale');

// Overrides any existing `package.json` config
signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: false
}); 

signale.success('Hello from the Global scope');
```

<div align="center">
  <img alt="Local Config" src="media/local-config.png" width="65%">
</div>

Also, scoped loggers can have their own independent configuration, overriding the one inherited by the parent instance or `package.json`. 

```js
// foo.js
const signale = require('signale');

signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: false
});

signale.success('Hello from the Global scope');

function foo() {
  // `fooLogger` inherits the config of `signale`
  const fooLogger = signale.scope('foo scope');

  // Overrides both `signale` and `package.json` configs
  fooLogger.config({
    displayFilename: true,
    displayTimestamp: false,
    displayDate: true
  });

  fooLogger.success('Hello from the Local scope');
}

foo();
```

<div align="center">
  <img alt="Scope Config" src="media/scope-config.png" width="65%">
</div>

## API

#### signale.`<logger>(message[, message]|messageObj|errorObj)`

##### **`logger`**

- Type: `Function`

Can be any default or custom logger.

##### **`message`**

- Type: `String`

Can be one or more comma delimited strings.

```js
const signale = require('signale');

signale.success('Successful operation');
//=> ✔  success  Successful operation

signale.success('Successful', 'operation');
//=> ✔  success  Successful operation
```

##### **`errorObj`**

- Type: `Error Object`

Can be any error object.

```js
const signale = require('signale');

signale.error(new Error('Unsuccessful operation'));
//=> ✖  error  Error: Unsuccessful operation
//        at Module._compile (module.js:660:30)
//        at Object.Module._extensions..js (module.js:671:10)
//        ...
```

##### **`messageObj`**

- Type: `Object`

Can be an object holding the `prefix`, `message` and `suffix` attributes, with `prefix` and `suffix` always prepended and appended respectively to the logged `message`.

```js
const signale = require('signale');

signale.complete({prefix: '[task]', message: 'Fix issue #59', suffix: '(@klauscfhq)'});
//=> [task] ☒  complete  Fix issue #59 (@klauscfhq)
```

#### signale.`scope(name[, name])`

Defines the scope name of the logger.

##### **`name`**

- Type: `String`

Can be one or more comma delimited strings.

```js
const signale = require('signale');

const foo = signale.scope('foo'); 
const fooBar = signale.scope('foo', 'bar');

foo.success('foo');
//=> [foo] › ✔  success  foo

fooBar.success('foo bar');
//=> [foo] [bar] › ✔  success  foo bar
```

#### signale.`unscope()`

Clears the scope name of the logger.

```js
const signale = require('signale');

const foo = signale.scope('foo'); 

foo.success('foo');
//=> [foo] › ✔  success  foo

foo.unscope();

foo.success('foo');
//=> ✔  success  foo
```

#### signale.`config(settingsObj)`

Sets the configuration of an instance overriding any existing global or local configuration.

##### **`settingsObj`**

- Type: `Object`

Can hold any of the documented [options](#global).

```js
// foo.js
const signale = require('signale');

signale.config({
  displayFilename: true,
  displayTimestamp: true,
  displayDate: true
});

signale.success('Successful operations');
//=> [2018-5-15] [11:12:38] [foo.js] › ✔  success  Successful operations
```

#### signale.`time([, label])`

- Return Type: `String`

Sets a timers and accepts an optional label. If none provided the timer will receive a unique label automatically.

Returns a string corresponding to the timer label. 

##### **`label`**

- Type: `String`

Label corresponding to the timer. Each timer must have its own unique label.

```js
const signale = require('signale');

signale.time();
//=> ▶  timer_0  Initialized timer...

signale.time();
//=> ▶  timer_1  Initialized timer...

signale.time('label');
//=> ▶  label    Initialized timer...
```

#### signale.`timeEnd([, label])`

- Return Type: `Object`

Deactivates the timer to which the given label corresponds. If no label is provided the most recent timer, that was created without providing a label, will be deactivated.

Returns an object `{label, span}` holding the timer label and the total running time.

##### **`label`**

- Type: `String`

Label corresponding to the timer, each timer has its own unique label.

```js
const signale = require('signale');

signale.time();
//=> ▶  timer_0  Initialized timer...

signale.time();
//=> ▶  timer_1  Initialized timer...

signale.time('label');
//=> ▶  label    Initialized timer...

signale.timeEnd();
//=> ◼  timer_1  Timer run for: 2ms

signale.timeEnd();
//=> ◼  timer_0  Timer run for: 2ms

signale.timeEnd('label');
//=> ◼  label    Timer run for: 2ms
```

## Development

For more info on how to contribute to the project, please read the [contributing guidelines](https://github.com/klauscfhq/signale/blob/master/contributing.md).

- Fork the repository and clone it to your machine
- Navigate to your local fork: `cd signale`
- Install the project dependencies: `npm install` or `yarn install`
- Lint code for errors: `npm test` or `yarn test`

## Team

- Klaus Sinani [(@klauscfhq)](https://github.com/klauscfhq)

## License

[MIT](https://github.com/klauscfhq/signale/blob/master/license.md)
