import O from './define.js'
import Is from './is.js'
import Log from './log.js'
import Fail from './errors.js'

export { O }
export {
  Is,
  Log,
  Fail,
}

export const echo = x => x
export const delay = setTimeout
delay.clear = clearTimeout
export const sleep = ms => new Promise(done => delay(done, ms))

O.use(Array, {
  is(x) {
    return Array.isArray(x)
  },

  fill(i, cb = x => x) {
    const a = Array(i)
    for (; i--;) a[ i ] = cb(i)
    return a
  },
})

O.use(Array.prototype, {
  get head() { return this[ 0 ] },
  get tail() { return this.at(-1) },
  get uniqe() { return Array.from(new Set(this)) },
})

O.use(String.prototype, {
  get up() { return this.toUpperCase() },
  get low() { return this.toLowerCase() },
})

O.alias(Array.prototype, 'head',  String.prototype)
O.alias(Array.prototype, 'tail',  String.prototype)
O.alias(Array.prototype, 'uniqe', String.prototype)
