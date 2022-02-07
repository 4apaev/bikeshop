import Is, { T } from './is.js'

const µ = null
const O = Object

export default function use() {
  if (arguments.length < 2)
    return O(arguments[ 0 ] ?? µ)

  let [[ c, e, w ], [ a, b ]] = T.args(arguments, Is.X, [[], []])

  Is.assert.X(a, 'use:trg')
  Is.assert.X(b, 'use:src')

  for (let k in b = get(b)) {
    b[ k ].get ?? (
      w != µ && (b[ k ].writable = w))
    e != µ && (b[ k ].enumerable = e)
    c != µ && (b[ k ].configurable = c)
  }
  return O.defineProperties(a, b)
}

export function get(a, b) {
  return b
    ? O.getOwnPropertyDescriptor(a, b)
    : O.getOwnPropertyDescriptors(a)
}

export function alias() {
  const props = []
  const targets = []
  T.args(arguments, Is.X, [ props, targets ])

  const key = props.shift()
  const src = targets.shift()
  const desc = get(src, key)

  props.length || props.push(key)
  targets.length || targets.push(src)

  for (let a of props) {
    for (let trg of targets)
      O.defineProperty(trg, a, desc)
  }
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

alias(O, use, 'create')
alias(O, use, 'assign', 'assign', 'mix')
alias(O, use, 'defineProperty', 'define', 'def')
alias(O, use, 'defineProperties', 'defines')
alias(O, use, 'getOwnPropertyNames', 'names')
alias(O, use, 'keys')
alias(O, use, 'values')
alias(O, use, 'entries')
alias(O, use, 'fromEntries', 'fromEntries', 'too')
alias(O, use, 'hasOwn', 'own')

use(use, {
  use, get, each, alias,

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
