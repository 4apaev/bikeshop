export const A = Array
export const O = Object
export const S = String
export const { constructor: Generator } = function* () {}


///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

export const { assign, values, keys, entries, fromEntries } = O

def(1, 0, 1, def, {
  get o() {
    return O.create(null)
  },
  assign, values, keys, entries, fromEntries,
  mix,  get, set,  decor, define, proto, from, alias,
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

def(1, 0, 1, A, {
  fill(i, cb = echo) {
    for (var a = A(i); i--;) a[ i ] = cb(i)
    return a
  },

  range(step, size, start = 0) {
    return A.fill(size, _ => start += step)
  },
})

def(1, 0, A.prototype, {
  get head() { return this[ 0 ] },
  get tail() { return this.at(-1) },
  get uniqe() { return A.from(new Set(this)) },
  pluck(k) { return this.map(x => x[ k ]) },

})

def(1, 0, S.prototype, {
  get up() { return this.toUpperCase() },
  get low() { return this.toLowerCase() },

  frmt(...a) {
    return this.replace(/\$(\S+)/g, a.length === 1 && typeof a.head == 'object'
      ? (o => (_, k) => o[ k ] ?? k)(a.head)
      : (_, k) => a[ k ])
  },

  rx(fl) {
    return new RegExp(this.replace(/( +)?\n+( +)?/g, ''), fl ?? '')
  },
})

alias(A.prototype, 'includes', 'has')
alias(S.prototype, 'includes', 'has')
alias(A.prototype, 'head', S.prototype)
alias(A.prototype, 'tail', S.prototype)

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

export default function def(...argv) {
  let t; let d; let ctx; let ns = []; let cew = []
  for (let a of argv) {
    t = typeof a
    if (t == 'number' || t == 'boolean') cew.push(a)
    else if (t.at() == 's') ns.push(a)
    else if (ctx) d ??= a
    else ctx ??= a
  }
  if (!d) throw new Error('property descriptor is undefined')
  const set = (k, v) => {
    v.configurable = cew[ 0 ] ?? v.configurable ?? 1
    v.enumerable = cew[ 1 ] ?? v.enumerable ?? 1; v?.get ?? (
      v.writable = cew[ 2 ] ?? v.writable ?? 1)
    O.defineProperty(ctx, k, v)
  }
  if (ns.length) ns.forEach(k => set(k, d))
  else entries(get(d)).forEach(a => set(...a))
  return ctx
}

export function mix(...a) {
  return assign(O.create(null), ...a)
}

export function get(a, b) {
  return b
    ? O.getOwnPropertyDescriptor(a, b)
    : O.getOwnPropertyDescriptors(a)
}

export function proto(a, b) {
  return b
    ? O.setPrototypeOf(a, b)
    : O.getPrototypeOf(a)
}

export function define(o, k, v) {
  return v
    ? O.defineProperty(o, k, v)
    : O.defineProperties(o, k)
}

export function from(x, cb) {
  return typeof cb == 'function' || typeof x == 'string'
    ? A.from(x, cb)
    : Symbol.iterator in O(x)
      ? fromEntries(x)
      : entries(x)
}

export function alias(a, b, c = b, d = a) {
  typeof c == 'string' || (d = c, c = b)
  return O.defineProperty(d, c, get(a, b))
}

export function set(o, k, v, readonly) {
  return readonly
    ? def(0, 0, 0, o, k, { value: v })
    : def(1, 0, o, k, {
      get() { return v },
      set(x) { return v = x } })
}

export function decor(o, k, v, cb) {
  return def(1, 0, o, k, {
    get() { return cb(0, o, k, v) },
    set(x) { return cb(1, o, k, v, x) } })
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

export const Log = (c => define(c.log, c))(console.context())

alias(Log, 'table', 't')
alias(Log, 'error', 'e')
alias(Log, 'error', 'err')

def(1, 0, 1, Log, {
  az(a, z) {
    const from = a.charCodeAt()
    const to = z.charCodeAt()
    const n = to - from

    A.fill(n)

    return A.fill(n, i => S.fromCharCode(i + from)).join('')
  },

  col(a) {
    this.log(a.join('\n'))
  },
  get g() {
    return this.groupEnd(), this
  },
  set g(x) {
    (x = S(x)).startsWith('[x]')
      ? this.groupCollapsed(x.slice(3))
      : this.group(x)
  },
})

Log.az.latin = Log.az('a', 'z')
Log.az.greek = Log.az('α', 'ω')
Log.az.cyril = Log.az('а', 'я')

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

export function tos(x) {
  return toString.call(x).slice(8, -1)
}

export function Is(x, m) {
  return It(x != null, m)
}

Is.raw = (x, m) => It(m, A.isArray(x?.raw))
Is.a   = (x, m) => It(m, A.isArray(x))

Is.i   = (x, m) => It(m, Number.isInteger(x))
Is.n   = (x, m) => It(m, Number.isFinite(x))
Is.E   = (x, m) => It(m, x instanceof Error)
Is.R   = (x, m) => It(m, x instanceof RegExp)
Is.G   = (x, m) => It(m, x instanceof Generator)
Is.P   = (x, m) => It(m, x instanceof Promise || typeof x?.then == 'function')
Is.b   = (x, m) => It(m, typeof x == 'boolean')
Is.f   = (x, m) => It(m, typeof x == 'function')
Is.s   = (x, m) => It(m, typeof x == 'string')
Is.o   = (x, m) => It(m, typeof x == 'object' && !!x)
Is.O   = (x, m) => It(m, tos(x) == 'Object')
Is.it  = (a, b, m) => It(m, a === b?.constructor)
Is.eq  = (a, b, m) => It(m, Eql(a, b))

export function Eql(a, b, t) {
  if (a === b) return !0
  if (O(a) !== b) return !1
  if ((t = tos(a)) != tos(b)) return !1
  if (t == 'Date') return +a === +b
  if (t == 'RegExp') return S(a) === S(b)
  if (t == 'Object') t = 'Array', a = O.entries(a), b = O.entries(b)
  else if (t == 'Map' || t == 'Set') t = 'Array', a = A.from(a), b = A.from(b)
  return t == 'Array'
    ? a.length === b.length && a.every((x, i) => Eql(x, b[ i ]))
    : S(a) === S(b)
}

function It(m, x, not = It.not ?? false, assert = It.assert ?? false) {
  It.not = It.assert = false
  if (x !== not) return true
  if (assert) throw new Error(`[not: ${ not }] ${ m ?? 'Epic Fail' }`)
  return false
}

def(1, 0, 1, Is, {
  get not() {
    It.not = true
    return Is
  },
  get assert() {
    It.assert = true
    return Is
  },
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

export function echo(x) {
  return x
}

export function sleep(ms, ...a) {
  return new Promise(ok => setTimeout(ok, ms, ...a))
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////

export function rand(a, b) {
  const r = Math.random()
  return b != null
    ? a + (0 | r * (b - a + 1))
    : a != null
      ? 0 | r * a
      : r
}

def(1, 0, 1, rand, {
  get bool() {
    return +rand > .5
  },

  get hex() {
    return (+rand).toString(16).slice(2)
  },

  s(n = 8, ui = n) {
    const ua = globalThis[ `Uint${ ui }Array` ] ?? Uint8Array
    return S.fromCharCode(...crypto.getRandomValues(new ua(n)))
  },

  valueOf() {
    return Math.random()
  },
})


