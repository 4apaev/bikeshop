/* eslint-disable max-len */
import Is, { raise } from './is.js'

const µ = null
const O = Object
Symbol.stop = Symbol('📛')

export const {
  own: hasOwn,
  assign: mix,
  fromEntries: from,
  entries,
  values,
  keys,
} = O

export function set(a, b, c) {
  return c
    ? O.defineProperty(a, b, c)
    : O.defineProperties(a, b)
}

export function get(a, b) {
  return b
    ? O.getOwnPropertyDescriptor(a, b)
    : O.getOwnPropertyDescriptors(a)
}

export default function use() {
  if (arguments.length < 2)
    return O(arguments[ 0 ] ?? µ)

  let cew = []
  let trg = []

  for (const a of arguments)
    [ cew, trg ][ +Is.complex(a) ].push(a)

  const  src = get(trg.pop())
  src || raise('[use] missing source')
  trg.length || raise('[use] missing target')
                                                      // eslint-disable-next-line brace-style
  for (let k in src) { (src[ k ].get ?? (
    cew[ 2 ] != µ && (src[ k ].writable = cew[ 2 ]))) // eslint-disable-next-line indent
    cew[ 1 ] != µ && (src[ k ].enumerable = cew[ 1 ]) // eslint-disable-next-line indent
    cew[ 0 ] != µ && (src[ k ].configurable = cew[ 0 ])
  }

  for (const x of trg) set(x, src)
  return trg[ 0 ]
}

export function alias() {
  let props = []
  let target = []

  for (const a of arguments)
    [ props, target ][ +Is.complex(a) ].push(a)

  const key = props.shift()
  const src = target.shift()

  key || raise('[alias] not found')
  src || raise('[alias] source not found')

  const desc = get(src, key)

  if (props.length === 0)
    target.forEach(trg => set(trg, key, desc))
  else if (target.length === 0)
    props.forEach(p => set(src, p, desc))
  else
    props.forEach(p => target.forEach(trg => set(trg, p, desc)))
}

export function each(a, cb, memo, ctx = this) {
  for (let [ k, v ] of a?.entries?.() ?? entries(a)) {
    let re = cb.call(ctx, v, k, memo, Symbol.stop)
    if (re === Symbol.stop) break
    memo = re
  }
  return memo
}

mix(each, {                                                                                  // eslint-disable-next-line brace-style
  kvm(o, fx, memo, ctx = this) { return each(o, (v, k, m) => fx.call(ctx, k, v, m), memo) }, // eslint-disable-next-line brace-style
  kmv(o, fx, memo, ctx = this) { return each(o, (v, k, m) => fx.call(ctx, k, m, v), memo) }, // eslint-disable-next-line brace-style
  vkm(o, fx, memo, ctx = this) { return each(o, (v, k, m) => fx.call(ctx, v, k, m), memo) }, // eslint-disable-next-line brace-style
  vmk(o, fx, memo, ctx = this) { return each(o, (v, k, m) => fx.call(ctx, v, m, k), memo) }, // eslint-disable-next-line brace-style
  mkv(o, fx, memo, ctx = this) { return each(o, (v, k, m) => fx.call(ctx, m, k, v), memo) }, // eslint-disable-next-line brace-style
  mvk(o, fx, memo, ctx = this) { return each(o, (v, k, m) => fx.call(ctx, m, v, k), memo) },
})

export function dig(a, b, c) {
  return a.split('.').every(k => b = b?.[ k ] ?? 0)
    ? b
    : c
}

dig.set = (a, b, c, tail = a.pop()) => ((
  a.reduce((o, k, i) =>
    o = o[ k ]
    ?? (o[ k ] = Is.n(+a[ i + 1 ])
      ? []
      : {}), b)[ tail ] = c), b)

use.get = get
use.set = set
use.dig = dig
use.use = use
use.each = each
use.alias = alias

use.keys = keys
use.values = values
use.entries = entries
use.assign = use.mix = mix
use.from = use.fromEntries = from

// since "from" appears to be reserved keyword
use(O, use, {
  get o() {
    return O.create(µ)
  },
})
