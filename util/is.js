// @ts-check
import Fail, { raise, assert } from './fail.js'

const A = Array
const O = Object
const µ = null

export { Fail, raise, assert }

/** @type {IS} */
export default function Is(a, b, m) {
  let c = T(b)
  return It(m, 'instance', typeof a == 'function'
    ? c == a.name || a[ Symbol.hasInstance ](b)
    : c == a)
}

Is.u = use('null',        /** @type {isu} */ x => x != µ)
Is.a = use('array',       /** @type {isa} */ x => Array.isArray(x))
Is.n = use('number',      /** @type {isn} */ x => Number.isFinite(x))
Is.i = use('integer',     /** @type {isi} */ x => Number.isInteger(x))
Is.s = use('string',      /** @type {iss} */ x => typeof x == 'string')
Is.b = use('boolean',     /** @type {isb} */ x => typeof x == 'boolean')
Is.f = use('function',    /** @type {isf} */ x => typeof x == 'function')
Is.o = use('object',      /** @type {iso} */ x => typeof x == 'object' && !!x)
Is.O = use('Object',      /** @type {isO} */ x => T(x) == 'Object')
Is.I = use('iterable',    /** @type {isI} */ x => Symbol.iterator in O(x))
Is.X = use('complexity',  /** @type {isX} */ x => x === O(x))
Is.raw = use('template',  /** @type {israw} x */ x => Array.isArray(x?.raw))
Is.eq = use('equality', equal)

/**
 * @param   {*} a
 * @param   {*} b
 * @returns {boolean}
 */
function equal(a, b) {
  if (a === b)
    return true

  let t = T(a)
  if (t != T(b))
    return false

  if (t == 'Object') {
    t = 'Array'
    a = O.entries(a)
    b = O.entries(b)
  }

  else if (t == 'Set' || t == 'Map') {
    t = 'Array'
    a = A.from(a)
    b = A.from(b)
  }

  return t == 'Array'
    ? a.length !== b.length
      ? false
      : a.every((/** @type {*} */ x, /** @type {number} */ i) =>
        equal(x, b[ i ]))
    : String(a) === String(b)
}

Is.equal = Is.eql = Is.eq
Is.complex = Is.x = Is.X
Is.iterable = Is.itr = Is.I

//////////////////////////////////////////////////////////////////////////////////////

/**
 * @param  {string} name
 * @param  {function} fn
 * @return {isIt}
 */
export function use(name, fn) {
  assert(typeof fn == 'function', `[is.use]: not a function "${ name }"`)
  const i = fn.length
  return i === 1
    ? (x, m) => It(m, name, fn(x))
    : i === 2
      ? (a, b, m) => It(m, name, fn(a, b))
      : (...a) => It(a[ i ], name, fn(...a))
}

//////////////////////////////////////////////////////////////////////////////////////

/**
 * @param  {string} m
 * @param  {string} name
 * @param  {boolean} x
 * @throws {Fail}
 * @return {boolean}
 */
function It(m, name, x) {
  const { not = false, fail = false } = It
  It.not  =  It.fail  = false
  if (x !== not)  return true

  fail && raise(m ?? `${ not
    ? 'not'
    : '' } expected ${ name }`)
  return false
}

It.not = false
It.fail = false

//////////////////////////////////////////////////////////////////////////////////////
// for typescript...
Is.not = Is
Is.assert = Is

O.defineProperties(Is, O.getOwnPropertyDescriptors({
  T, Fail, raise, use,
  get not() {
    It.not = true
    return Is
  },
  get assert() {
    It.fail = true
    return Is
  },
}))

//////////////////////////////////////////////////////////////////////////////////////

/**
 * @param  {?} x
 * @return {string}
 */
export function T(x) {
  return toString.call(x).slice(8, -1)
}

/**
 * @template P
 * @param  {Iterable<*>} args
 * @param  {typeof T} cb
 * @param  {P | *} prev
 * @return {P}
 */
T.args = (args, cb = T, prev = {}) => {
  for (let next of args) {
    let k = cb(next)
    ;(prev[ Is.b(k) // @ts-ignore
      ? k = +k
      : k ] ??= []).push(next)
  }
  return prev
}

/**
 * @typedef {(a: string | Function, b: any, m?: string) => boolean} IS
 * @prop {withMessage} u
 * @prop {withMessage} a
 * @prop {withMessage} n
 * @prop {withMessage} i
 * @prop {withMessage} s
 * @prop {withMessage} b
 * @prop {withMessage} f
 * @prop {withMessage} o
 * @prop {withMessage} O
 * @prop {withMessage} I
 * @prop {withMessage} X
 * @prop {withMessage} raw
 * @prop {withMessage} eq
 * @prop {withMessage} itr
 * @prop {IS} not
 * @prop {IS} assert
 *//**
 * @callback check
 * @param {*} x
 * @return {boolean}
 *//**
 * @callback withMessage
 * @param {*} x
 * @param {string=} m
 * @return {boolean}
 *//**
 * @callback isIt
 * @param {*} x
 * @param {string=} m
 * @return {boolean}
 *//**
 * @callback isu
 * @param {*} x
 * @return {x is !undefined}
 *//**
 * @callback isa
 * @param {*} x
 * @return {x is Array}
 *//**
 * @callback isn
 * @param {*} x
 * @return {x is number}
 *//**
 * @callback isi
 * @param {*} x
 * @return {x is number}
 *//**
 * @callback iss
 * @param {*} x
 * @return {x is string}
 *//**
 * @callback isb
 * @param {*} x
 * @return {x is boolean}
 *//**
 * @callback isf
 * @param {*} x
 * @return {x is function}
 *//**
 * @callback iso
 * @param {*} x
 * @return {x is object}
 *//**
 * @callback isO
 * @param {*} x
 * @return {x is Object}
 *//**
 * @callback isI
 * @param {*} x
 * @return {x is Iterable}
 *//**
 * @callback isX
 * @param {*} x
 * @return {x is (object | function)}
 *//**
 * @callback israw
 * @param {*} x
 * @return {x is TemplateStringsArray}
 */
