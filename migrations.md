# Migrations

## 1.x.x -> 2.0.0

### Named imports

If you use direct import signales in commonjs you should migrate to named imports:

```js
// replace this
const signale = require('signales') // doesn't work

// to this
const { signale } = require('signales') // ok
```

If you use ES modules there is no action to do.

### stderr stream by default

Also, by default, signales writes messages to stderr as of version 2.0.0.
In order use stdout stream pass that intention explicitly:

```js
import { Signale } from 'signales'

const signale = new Signale({ stream: process.stdout })
```

### New scopes formatting

Scope formatting was changed. Old formatter:

```js
signale.scope('foo', 'bar').success('hello')
//=> //=> [foo] [bar] › ✔  success  hello
```

New formatter:

```js
signale.scope('foo', 'bar').success('hello')
//=> //=> [foo::bar] › ✔  success  hello
```

In order to return to old formmater you can use new [`scopeFormatter`](https://github.com/anru/signales#scopeformatter) option
and built-in `Signales.barsScopeFormatter` formatter:

```js
import { Signales } from 'signales'

const logger = new Signales({ scopeFormatter: Signales.barsScopeFormatter, scope: ['foo', 'bar'] })
logger.success('hello')
//=> [foo] [bar] › ✔  success  hello
```
