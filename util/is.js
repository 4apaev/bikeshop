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
 * @typedef {(x: any, m?: string) => boolean} TypeIs             *//**
 * @typedef {(a: any, m?: string) => boolean} TIs                *//**
 * @typedef {(a: any, b: any, m?: string) => boolean} TwoTypeIs  */

/**
 * @parse
 * @template {function} T
 * @param {T} a
 * @param {*=} b
 * @param {string=} m
 * @return {b is typeof T}
 */
export default function Is(a, b, m) {
  return arguments.length < 2
    ? a != undefined
    : It(m, 'instance', a?.name == T(b) || a[ Symbol.hasInstance ](b))
}

/**
 * @param {string} name
 * @param {TypeIs} fn
 */
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

/**
 * @param  {*} x
 * @return {string}
 */
export function T(x) {
  return toString.call(x).slice(8, -1)
}

/**
 * @param {string} m
 * @param {string} name
 * @param {boolean} x
 */
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

Is.T = T
Is.use = use
Is.not /** @type { typeof Is } */ = Is
Is.assert /** @type { typeof Is } */ = Is
It.not = It.fail = false /* for typescript */

Object.defineProperties(Is, Object.getOwnPropertyDescriptors({
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
use('integer  i int'    , Is.i =  /** @type {TypeIs} */ x => Number.isInteger(x))
use('number   n num'    , Is.n =  /** @type {TypeIs} */ x => Number.isFinite(x))
use('array    a arr'    , Is.a =  /** @type {TypeIs} */ x => Array.isArray(x))
use('string   s str'    , Is.s =  /** @type {TypeIs} */ x => typeof x == 'string')
use('boolean  b bool'   , Is.b =  /** @type {TypeIs} */ x => typeof x == 'boolean')
use('function f fn'     , Is.f =  /** @type {TypeIs} */ x => typeof x == 'function')
use('object   o obj'    , Is.o =  /** @type {TypeIs} */ x => typeof x == 'object' && !!x)
use('Error    e err'    , Is.e =  /** @type {TypeIs} */ x => Error[ Symbol.hasInstance ](x))
use('RegExp   r rx'     , Is.rx = /** @type {TypeIs} */ x => RegExp[ Symbol.hasInstance ](x))
use('Object   O Obj'    , Is.O =  /** @type {TypeIs} */ x => T(x) == 'Object')
use('complex  x cmplx'  , Is.x =  /** @type {TypeIs} */ x => x === Object(x))
use('iterable I itr'    , Is.I =  /** @type {TypeIs} */ x => Symbol.iterator in Object(x))
use('ok'                , Is.ok = /** @type {TypeIs} */ x => x != null)
use('template tmpl'     , Is.tmpl = /** @type {TypeIs} */ x => Array.isArray(x?.raw))
use('equal    eq eql'   , function equal(a, b, t) {
  if (a === b)                  return true
  if ((t = T(a)) != T(b))       return false
  if (t == 'Array')             return a.length === b.length && a.every((x, i) => equal(x, b[ i ]))
  if (t == 'Object')            return equal(Object.entries(a), Object.entries(b))
  if (t == 'Set' || t == 'Map') return equal(Array.from(a), Array.from(b))
  else                          return String(a) === String(b)
})

