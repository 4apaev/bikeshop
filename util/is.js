// @ts-check
/* eslint-disable comma-spacing */
import Fail from './fail.js'

export const {
  deny,
  raise,
  assert,
} = Fail

export { Fail }

/**
 * @typedef {import('../_/types/utils.d').IS} IS *//**
 * @typedef {import('../_/types/utils.d').IT} IT *//**
 * @typedef {import('../_/types/utils.d').Use} Use *//**
 * @typedef {import('../_/types/utils.d').IsType} IsType */

/**
 * @type {IS}
 */
export default function Is(a, b, m) {
  let c = T(b)
  return It(m, 'instance', typeof a == 'function'
    ? c == a.name || a[ Symbol.hasInstance ](b)
    : c == a)
}

/** @type {Use} */
export function use(name, fn) {
  const i = fn.length
  const [ k, ...alias ] = name.match(/\S+/g)
  Is[ k ] = i === 1
    ? (x, m) => It(m, k, fn(x))
    : i === 2
      ? (a, b, m) => It(m, k, fn(a, b)) // @ts-ignore
      : (...a) => It(a[ i ], k, fn(...a))
  for (const a of alias)
    Is[ a ] = Is[ k ]
}

export function T(x) {
  return toString.call(x).slice(8, -1)
}

/** @type {IT} */
function It(m, name, x) {
  const { not, fail } = It
  It.not = It.fail = false

  if (x !== not)
    return true

  fail && raise(m ?? not
    ? 'unexpected ' + name
    :   'expected ' + name)

  return false
}

It.not = It.fail = false /* for typescript */
Is.use = use             /* for typescript */
// Is.not = Is.assert = Is  /* for typescript */

Object.defineProperties(Is, Object.getOwnPropertyDescriptors({
  use,
  get not() {
    It.not = true
    return Is
  },
  get assert() {
    It.fail = true
    return Is
  },
}))

/* * *
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
    * * *  USE  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
   * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * */

use('integer  i int'    , Is.i = Number.isInteger)
use('number   n num'    , Is.n = Number.isFinite)
use('array    a arr'    , Is.a = Array.isArray)
use('string   s str'    , Is.s = x => typeof x == 'string')
use('boolean  b bool'   , Is.b = x => typeof x == 'boolean')
use('function f fn'     , Is.f = x => typeof x == 'function')
use('object   o obj'    , Is.o = x => typeof x == 'object' && !!x)
use('Error    e err'    , Is.e = x => Error[ Symbol.hasInstance ](x))
use('Object   O Obj'    , Is.O = x => T(x) == 'Object')
use('complex  x cmplx'  , Is.x = x => x === Object(x))
use('iterable I itr'    , Is.I = x => Symbol.iterator in Object(x))
use('ok'                , x => x != null)
use('template tmpl'     , x => Array.isArray(x?.raw))
use('equal    eq eql'   , function equal(a, b, t) {
  if (a === b)                  return true
  if ((t = T(a)) != T(b))       return false
  if (t == 'Array')             return a.length === b.length && a.every((x, i) => equal(x, b[ i ]))
  if (t == 'Object')            return equal(Object.entries(a), Object.entries(b))
  if (t == 'Set' || t == 'Map') return equal(Array.from(a), Array.from(b))
  else                          return String(a) === String(b)
})

