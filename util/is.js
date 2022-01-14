import { Stream } from 'stream'
import { isDeepStrictEqual } from 'util'
import Fail from './errors.js'

let NOT = false; let FAIL = false

function It(m, x) {
  const [ not, fail ] = [ NOT, FAIL ]
  NOT = false, FAIL = false
  if (x !== not) return true
  if (fail) throw new Fail(417, m)
  return false
}

export default function Is(a, b, c) { // eslint-disable-next-line multiline-ternary
  return arguments.length === (FAIL ? 3 : 2)
    ? Is.it(a, b, c)
    : It(b, a != null)
}

Is.use = (name, fn) => Is[ name ] = fn(It)

Is.a = (x, m) => It(m, Array.isArray(x))
Is.i = (x, m) => It(m, Number.isInteger(x))
Is.n = (x, m) => It(m, Number.isFinite(x))
Is.B = (x, m) => It(m, Buffer.isBuffer(x))
Is.S = (x, m) => It(m, x instanceof Stream)
Is.s = (x, m) => It(m, typeof x == 'string')
Is.b = (x, m) => It(m, typeof x == 'boolean')
Is.f = (x, m) => It(m, typeof x == 'function')
Is.o = (x, m) => It(m, typeof x == 'object' && !!x)
Is.eq  = (a, b, m) => It(m, isDeepStrictEqual(a, b))
Is.it  = (a, b, m) => {
  const c = toString.call(b).slice(8, -1)
  return It(m, typeof a == 'function'
    ? c == a.name || Object(b) instanceof a
    : c == a)
}

Object.defineProperties(Is, Object.getOwnPropertyDescriptors({
  get not() { return (NOT = true), Is },
  get assert() { return (FAIL = true), Is },
}))
