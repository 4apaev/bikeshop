/* eslint-disable comma-spacing */// @ts-check
import Fail from './fail.js'

/**
 * @typedef {(x: any, m?: string) => boolean} TypeIs             *//**
 * @typedef {(a: any, m?: string) => boolean} TIs                *//**
 * @typedef {(a: any, b: any, m?: string) => boolean} TwoTypeIs  */
/**
 * @template {function} T
 * @param {T} a
 * @param {*} [b]
 * @param {string} [m]
 * @return {b is typeof T}
 */
export default function Is(a, b, m) {
  return arguments.length < 2 ? a != undefined : It(m, 'instance', a?.name == T(b) || a[ Symbol.hasInstance ](b))
}

/**
 * @param {string} name
 * @param {TypeIs} fn
 */
export function use(name, fn) {
  const i = fn.length
  const [ k, ...alias ] = name.match(/\S+/g) // @ts-ignores
  Is[ k ] = i === 1 ? (x, m) => It(m, k, fn(x)) : i === 2 ? (a, b, m) => It(m, k, fn(a, b)) : (...a) => It(a[ i ], k, fn(...a))
  for (const a of alias) Is[ a ] = Is[ k ]
}

/**
 * @param  {*} x
 * @return {string}
 */
export function T(x) { // @ts-ignore
  return toString.call(x).slice(8, -1)
}

/**
 * @param {string} m
 * @param {string} name
 * @param {boolean} x
 */
function It(m, name, x) {
  const { not, assert } = It
  It.not = It.assert = false
  if (x !== not) return true
  assert && Fail.raise(m ?? not ? 'unexpected ' + name :   'expected ' + name)
  return false
}

Is.use = use
It.not = It.assert = false

Object.defineProperty(Is, 'not', {
  get() {
    setTimeout(_ => It.not = !_, 0, It.not = true)
    return Is
  },
})

Object.defineProperty(Is, 'assert', {
  get() {
    setTimeout(_ => It.assert = !_, 0, It.assert = true)
    return Is
  },
})

use('number   n num' , Is.n =  /** @type {TypeIs} */ x => Number.isFinite(x))
use('array    a arr' , Is.a =  /** @type {TypeIs} */ x => Array.isArray(x))
use('boolean  b bool', Is.b =  /** @type {TypeIs} */ x => typeof x == 'boolean')
use('string   s str' , Is.s =  /** @type {TypeIs} */ x => typeof x == 'string')
use('function f fn'  , Is.f =  /** @type {TypeIs} */ x => typeof x == 'function')
use('object   o obj' , Is.o =  /** @type {TypeIs} */ x => typeof x == 'object' && !!x)
use('Object   O Obj' , Is.O =  /** @type {TypeIs} */ x => T(x) == 'Object')
use('iterable I itr' , Is.I =  /** @type {TypeIs} */ x => Symbol.iterator in Object(x))
