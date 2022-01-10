// @ts-check

import { Stream } from 'stream'
import {
  isRegExp,
  isPromise,
  isNativeError as NErr,
} from 'util/types'

import {
  isDeepStrictEqual as eq,
} from 'util'

import Fail from './errors.js'

/**
 * @type {is}
 */
export default function Is(x, m) {
  return It(m, x != null)
}

/**
 * @param {string} name
 * @param {Function} fn
 * @return {is}
 */
Is.use = (name, fn) => Is[ name ] = fn(It)

/**
 * @param {*} x
 * @return {string}
 */
Is.tos = x => toString.call(x).slice(8, -1)


/** @type {is} */ Is.u   = (x, m) => It(m, x === undefined)
/** @type {is} */ Is.i   = (x, m) => It(m, Number.isInteger(x))
/** @type {is} */ Is.n   = (x, m) => It(m, Number.isFinite(x))
/** @type {is} */ Is.a   = (x, m) => It(m, Array.isArray(x))
/** @type {is} */ Is.raw = (x, m) => It(m, Array.isArray(x?.raw))
/** @type {is} */ Is.B   = (x, m) => It(m, Buffer.isBuffer(x))

/** @type {is} */ Is.E   = (x, m) => It(m, x instanceof Error)
/** @type {is} */ Is.S   = (x, m) => It(m, x instanceof Stream)
/** @type {is} */ Is.R   = (x, m) => It(m, isRegExp(x))
/** @type {is} */ Is.P   = (x, m) => It(m, isPromise(x))
/** @type {is} */ Is.nodErr = (x, m) => It(m, NErr(x))

/** @type {is} */ Is.b   = (x, m) => It(m, typeof x == 'boolean')
/** @type {is} */ Is.f   = (x, m) => It(m, typeof x == 'function')
/** @type {is} */ Is.s   = (x, m) => It(m, typeof x == 'string')
/** @type {is} */ Is.o   = (x, m) => It(m, typeof x == 'object' && !!x)
/** @type {is} */ Is.O   = (x, m) => It(m, Is.tos(x) == 'Object')

/**
 * @param {*} a
 * @param {*} b
 * @param {string} [m]
 * @return {boolean}
 */
Is.eq  = (a, b, m) => It(m, eq(a, b))

/**
 * @param {Function} a
 * @param {*} b
 * @param {string} [m]
 * @return {boolean}
 */
Is.it  = (a, b, m) => It(m, a == b?.constructor)

let NOT = 0
let FAIL = 0
Object.defineProperty(Is, 'not', {
  get() {
    NOT = 1
    return Is
  },
})

Object.defineProperty(Is, 'assert', {
  get() {
    FAIL = 1
    return Is
  },
})


/**
 * @param {string|null} m
 * @param {boolean} x
 * @throws {Fail}
 * @return {boolean}
 */
function It(m, x) {
  const [ not, fail ] = [ NOT, FAIL ]
  NOT = 0, FAIL = 0

  if (+x !== not)
    return true

  if (fail)
    throw new Fail(417, m)

  return false
}


/**
 * @callback is
 * @param {*} x
 * @param {string} [m]
 * @return {boolean}
 */


