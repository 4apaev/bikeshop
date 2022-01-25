import O from './define.js'
import Is from './is.js'
import Log from './log.js'
import Fail from './fail.js'

export {
  O,
  Is,
  Log,
  Fail,
}

export const echo = x => x
export const delay = setTimeout
delay.clear = clearTimeout

export function sleep(ms) {
  return new Promise(done => delay(done, ms))
}

export function sanitizePath(x) {
  return x.split('/').reduce((prev, next) => {
    if (next == '..')
      prev.pop()
    else if (next != '.')
      prev.push(next)
    return prev
  }, []).join('/')
}

export function pipe(...fns) {
  return prev =>
    fns.reduce((prev, next) =>
      next(prev), prev)
}

export function compose(...fns) {
  return prev =>
    fns.reduceRight((prev, next) =>
      next(prev), prev)
}

export function bind(fn, when, strategy) {
  const i = when == 'after'
  const argv = strategy == 'merge'
    ? (a, b) => a.map((x, i) => b[ i ] ?? x)
    : (a, b) => a.concat(b)

  return (...a) => (...b) => {
    const ctx = [ a, b ][ +i  ].shift()
    return fn.apply(ctx, argv(a, b))
  }
}


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
