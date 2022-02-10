
import Is, { T, raise } from './is.js'

const µ = null
const O = Object

export default function use() {
  if (arguments.length < 2) return O(arguments[ 0 ] ?? µ)
  let [[ c, e, w ], target ] = T.args(arguments, Is.X, [[], []])

  const src = O.getOwnPropertyDescriptors(target.pop())
  /*     */ src || raise('[use] missing source')
  target.length || raise('[use] missing target')

  for (let k in src) {
    (src[ k ].get ?? (
      w != µ && (src[ k ].writable = w)))
    e != µ && (src[ k ].enumerable = e)
    c != µ && (src[ k ].configurable = c)
  }

  for (const trg of target)
    O.defineProperties(trg, src)
  return target[ 0 ]
}

export function def(a, b, c) {
  return c
    ? O.defineProperty(a, b, c)
    : O.defineProperties(a, b)
}

export function get(a, b) {
  return b
    ? O.getOwnPropertyDescriptor(a, b)
    : O.getOwnPropertyDescriptors(a)
}

/**
 * @example
 * alias(src, key)
 * alias(src,  ...props)
 * alias(src, ...trg, ...props)
 */
export function alias() {
  const [ props, target ] = T.args(arguments, Is.X, [[], []])

  const key = props.shift()
  const src = target.shift()

  key || raise('[alias] not found')
  src || raise('[alias] source not found')

  const desc = O.getOwnPropertyDescriptor(src, key)

  if (props.length === 0)
    target.forEach(trg => O.defineProperty(trg, key, desc))

  else if (target.length === 0)
    props.forEach(p => O.defineProperty(src, p, desc))

  else
    props.forEach(p => target.forEach(trg => O.defineProperty(trg, p, desc)))

  return desc
}

export function each(a, cb, prev) {
  const stop = Symbol('📛')
  for (let [ next, v ] of a?.entries?.() ?? O.entries(a)) {
    prev = cb(v, next, prev, stop)
    if (prev === stop)
      break
  }
  return prev
}

export function merge(v, k, params) {
  if (k in params) {
    if (Is.a(params[ k ]))
      params[ k ].push(v)
    else
      params[ k ] = v
  }
  else {
    params[ k ] = v
  }
  return params
}

use.use   = O.use   = use
use.get   = O.get   = get
use.each  = O.each  = each
use.alias = O.alias = alias
use.merge = O.merge = merge

export const mix = use.mix   = O.mix   = O.assign
export const own = use.own   = O.own   = O.hasOwn
export const too = use.too   = O.too   = O.fromEntries

export const keys    = use.keys    = O.keys
export const values  = use.values  = O.values
export const entries = use.entries = O.entries

// since "from" appears to be reserved keyword
use(O, use, {
  get o() {
    return O.create(µ)
  },

  from(a, b) {
    return Is.I(a)
      ? O.fromEntries(a?.entries?.()
        ?? Array.from(a, b ??= (v, i) => [ i, v ]))
      : O.entries(a)
  },
})
