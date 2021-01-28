# Migrations

## 1.x.x -> 2.0.0

Replace direct commonjs import to named imports:

```js
// replace this
const signale = require('signales') // not ok

// to this
const { signale } = require('signales') // ok
```
