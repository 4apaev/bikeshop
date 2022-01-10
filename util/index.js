import Is from './is.js'
import Log from './log.js'
import Def from './define.js'
import Fail, { HTTPFail } from './errors.js'

export { Def }
export {
  Is,
  Log,
  Fail,
  HTTPFail,
}

export const echo = x => x
export const delay = setTimeout
delay.clear = clearTimeout
export const sleep = ms => new Promise(done => delay(done, ms))

Def.use(Object.is, {
  o(x) { return typeof x == 'object' && !!x },
  O(x) { return toString.call(x) == '[object Object]' },
})

Def.use(Array, {
  is(x) {
    return Array.isArray(x)
  },

  fill(i, cb = x => x) {
    const a = Array(i)
    for (; i--;) a[ i ] = cb(i)
    return a
  },
})

Def.use(Array.prototype, {
  get head() { return this[ 0 ] },
  get tail() { return this.at(-1) },
  get uniqe() { return Array.from(new Set(this)) },
})


Def.use(String.prototype, {
  get up() { return this.toUpperCase() },
  get low() { return this.toLowerCase() },
})

Def.alias(Array.prototype, 'head',  String.prototype)
Def.alias(Array.prototype, 'tail',  String.prototype)
Def.alias(Array.prototype, 'uniqe', String.prototype)
