const O = Object


const {
  entries,
  fromEntries,
  getOwnPropertyDescriptor: getDesc,
  getOwnPropertyDescriptors: getDescs,
  defineProperty,
  create,
  assign,
} = O


export default function def() {
  let t, o, n, d
  const cew = []
  for (const a of arguments) {
    if ((t = (typeof a)[ 0 ]) == 'n' || t == 'b')  cew.push(a)
    else if (t == 's')  n = a
    else if (o)  d = a
    else o = a
  }
  let it = n
    ? [[ n, d ]]
    : entries(getDescs(d))
  for (let [ k, v ] of it) {
    v.enumerable = cew[ 1 ] ?? v.enumerable ?? 1
    v.configurable = cew[ 0 ] ?? v.configurable ?? 1; v?.get ?? (
      v.writable = cew[ 2 ] ?? v.writable ?? 1)
    defineProperty(o, k, v)
  }
  return o
}

function use(a, b) {
  return def(1, 0, 1, a, b)
}

function get(a, b) {
  return b
    ? getDesc(a, b)
    : getDescs(a)
}

function alias(a, b, c = b, d = a) {
  typeof c == 'string' || (d = c, c = b)
  return defineProperty(d, c, getDesc(a, b))
}

function merge(...a) {
  return assign(O.o, ...a)
}

use(def, {
  use, get, alias, merge,
  entries, fromEntries,
  create, assign,
  
  get o() {
    return create(null)
  },

  from(x) {
    return Symbol.iterator in O(x)
      ? fromEntries(x)
      : entries(x)
  },
})

