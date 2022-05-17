// @ts-check
/* eslint-disable max-len */

import Fail from './fail.js'

export const µ = undefined
export const O = Object
export const stop = Symbol('📛')

// @ts-ignore
Symbol.stop = stop

export const {
  keys,
  values,
  assign,
  fromEntries,
} = Object

export default function use() {
  if (arguments.length < 2)
    return O(arguments[ 0 ])

  // eslint-disable-next-line one-var
  let a, trg = [], cew = [], src = []

  /** @type {PropertyDescriptorMap} */
  let dsc = {}

  for (a of arguments)
    O(a) === a ? cew.length ? src.push(a) : trg.push(a) : cew.push(a)

  if (src.length === 0)
    src.push(trg.pop())

  else if (trg.length === 0)
    trg.push(src.shift())

  trg.length || Fail.raise('[use] missing target')
  src.length || Fail.raise('[use] missing source')

  for (a of src)
    assign(dsc, O.getOwnPropertyDescriptors(a))

  if (cew.length) {                                        // eslint-disable-next-line brace-style
    for (a in dsc) { (dsc[ a ].get ?? (
      cew[ 2 ] == µ || (dsc[ a ].writable   = cew[ 2  ]))) // eslint-disable-next-line indent
      cew[ 1 ] == µ || (dsc[ a ].enumerable   = cew[ 1 ])  // eslint-disable-next-line indent
      cew[ 0 ] == µ || (dsc[ a ].configurable = cew[ 0 ])
    }
  }

  for (a of trg)
    O.defineProperties(a, dsc)
  return a
}

export function alias() { // eslint-disable-next-line one-var
  let a, dsc, key, src, props = [], target = []

  for (a of arguments)
    [ props, target ][ +(O(a) === a) ].push(a)

  key = props.shift()
  src = target.shift()

  key ?? Fail.raise('[alias]: missing prop')
  src ?? Fail.raise('[alias]: missing source')

  props.length || ([ key, ...props ] = key.match(/\S+/g))
  props.length || props.push(key)

  if (target.length === 0 || src !== arguments[ 0 ])
    target.push(src)

  dsc = O.getOwnPropertyDescriptor(src, key)
  for (a of target) {
    for (let p of props)
      O.defineProperty(a, p, dsc)
  }
  return a
}

/**
 * @param {*} it
 * @returns {Array<[*, *]>}
 */
export function entries(it) {
  return Symbol.iterator in O(it)
    ? it?.entries?.() ?? Array.from(it, (x, i) => [ i, x ])
    : O.entries(it)
}

/**
 * @template T, C
 * @param {T} it
 * @param {(v: any, k: PropertyKey) => Symbol | any} cb
 * @param {C} ctx
 * @return {C}
 */
export function each(it, cb, ctx = this) {
  for (let [ k, v ] of entries(it)) {
    if (stop === cb.call(ctx, v, k))
      break
  }
  return ctx
}

/**
 * @template T, M, C
 * @param {T} it
 * @param {(m: M, v: any, k: PropertyKey) => Symbol | M} cb
 * @param {M} memo
 * @param {C} [ctx]
 * @return {M}
 */
export function reduce(it, cb, memo, ctx = this) {
  for (let [ k, v ] of entries(it)) {
    let me = cb.call(ctx, memo, v, k)
    if (stop === me)
      break
    memo = me
  }
  return memo
}

use(O, use, 1, 0, {
  get o() {
    return O.create(null)
  },
})

each.kv    = (o, f,    x) => each(o,    (v, k) => f.call(x, k, v),       x)
reduce.kvm = (o, f, m, x) => reduce(o, (m, v, k) => f.call(x, k, v, m), m, x)
reduce.vkm = (o, f, m, x) => reduce(o, (m, v, k) => f.call(x, v, k, m), m, x)
reduce.mkv = (o, f, m, x) => reduce(o, (m, v, k) => f.call(x, m, k, v), m, x)

use.keys = keys
use.values = values
use.entries = entries
use.mix = use.assign = assign
use.from = use.fromEntries = fromEntries
