export const µ = undefined
export const END = Symbol('⛔️')
export const A = Array
export const S = String
export const P = Promise
export const O = Object
export const F = Function

export const delay = setTimeout
delay.clear = clearTimeout

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function is(a, b) {
  return arguments.length === 2
    ? tos(b) === (typeof a == 'string'
      ? a
      : a.name)
    : a != µ
}

export function tos(x) {
  return toString.call(x)
    .slice(8, -1)
}

is.not = (...a) => !is(...a)
is.n = x => x === +x
is.i = x => x === 0 | x
is.a = x => A.isArray(x)
is.b = x => typeof x == 'boolean'
is.f = x => typeof x == 'function'
is.n = x => typeof x == 'number'
is.s = x => typeof x == 'string'
is.S = x => typeof x == 'symbol'
is.o = x => typeof x == 'object' && !!x
is.O = x => tos(x) == 'Object'
is.ctx = x => x === O(x)
is.itr = x => Symbol.iterator in O(x)
is.t = (a, b) => a.includes((typeof b)[ 0 ])
is.eq = (a, b) => {
  if (a === b) return true
  if (a !== O(a)) return false
  let t = tos(a)
  if (t === tos(b)) return false
  if (t == 'Object') t = 'Array', a = O.entries(a), b = O.entries(b)
  else if (t == 'Set' || t == 'Map') t = 'Array', a = A.from(a), b = A.from(b)
  if (t.endsWith('Array')) return a.length === b.length && a.every((x, i) => is.eq(x, b[ i ]))
  else return a.toString() === b.toString()
}

is.empty = x => {
  for (let k in x)
    return false
  return !x
}

is.use = (k, fn) => {
  const i = fn.length
  const [ not, asrt, notAsrt ] = [[], [
    a => !fn(a),
    (a, b) => fn(a) || raise(b),
    (a, b) => !fn(a) || raise(b),
  ], [
    (a, b) => !fn(a, b),
    (a, b, c) => fn(a, b) || raise(c),
    (a, b, c) => !fn(a, b) || raise(c),
  ]][ i ]
  is[ k ] ??= fn
  fn.assert ??= asrt ?? ((...a) => fn(...a) || raise(a[ i ]))
  is.not[ k ] ??= not ?? ((...a) => !fn(...a))
  is.not[ k ].assert ??= notAsrt || ((...a) => !fn(...a) || raise(a[ i ]))
}

for (let [ k, fn ] of O.entries(is)) k != 'not' && k != 'use' && is.use(k, fn)

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function len(x) { return x?.length }
export function echo(x) { return x }
export function raise(a, b) { throw new Error(a, b) }
export function assert(a, b) { a || raise(b) }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function sleep(...a) {
  return new P(ok =>
    delay(ok, ...a))
}

export function debounce(fn, ms) {
  let id
  return (...a) => {
    delay.clear(id)
    id = delay(fn, ms, ...a)
  }
}

export function once(fn, ctx) {
  let re, done
  return function () {
    if (done) return re
    done = true
    return re = fn.apply(ctx ?? this, arguments)
  }
}

export function bind(fn, ...a) {
  return (ctx, ...b) =>
    fn.apply(ctx, a.concat(b))
}

export function bcomb(n) {
  let a = A(2 ** n)
  for (let x, y = a.length; y--;) {
    a[ y ] = A(x = n)
    for (; x--;) {
      a[ y ][ x ] = (y >> x) & 1
        ? 1
        : 0
    }
  }
  return a
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


export function get(a, b) {
  return b
    ? O.getOwnPropertyDescriptor(a, b)
    : O.getOwnPropertyDescriptors(a)
}

export function from(a) {
  return Symbol.iterator in O(a)
    ? O.fromEntries(a?.entries?.() ?? A.from(a, (x, i) => [ i, x ]))
    : O.entries(a)
}

export function alias(a, b, c = b, d = a) {
  is.t('s', c) || (d = c, c = b)
  return O.defineProperty(d, c, O.getOwnPropertyDescriptor(a, b))
}

export function def() {
  let argv = [[], []]
  for (let a of arguments) argv[ +(a === +a) ].push(a)
  let [ o, n, d ] = argv[ 0 ]
  assert(o, 'missing target')                                    // eslint-disable-next-line multiline-ternary
  assert(d = d ? { [ n ]: d } : get(n), 'missing descriptor')    // eslint-disable-next-line brace-style
  for (let k of O.keys(d)) { d[ k ].get ?? (                     //
    d[ k ].writable = argv[ 1 ][ 2 ] ?? d[ k ].writable ?? 1)    // eslint-disable-next-line indent
    d[ k ].enumerable = argv[ 1 ][ 1 ] ?? d[ k ].enumerable ?? 1 // eslint-disable-next-line indent
    d[ k ].configurable = argv[ 1 ][ 0 ] ?? d[ k ].configurable ?? 1
  }
  return O.defineProperties(o, d)
}
// eslint-disable-next-line multiline-ternary
bcomb(3).forEach(([ c, e, w ]) => def[ (c ? 'c' : 'x') + (e ? 'e' : 'x') + (w ? 'w' : 'x') ] = (o, n, d) => def(c, e, w, o, n, d))

export function use(o, n, d) {
  return def.cxw(o, n, d)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function Log() {
  console.log.apply(console, arguments)
}

def(Log, console.context())
alias(Log, 'group', 'open')
alias(Log, 'groupEnd', 'end')
alias(Log, 'groupCollapsed', 'compact')

def.cxw(Log, {
  intl: new Intl.DateTimeFormat([], {
    year: 'numeric',
    month: 'short',
    weekday: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hourCycle: 'h23',
    dayPeriod: 'long',
    era: 'long',
  }),

  get now() {
    return Log.intl.format(new Date)
  },

  get g() {
    Log.groupEnd()
    return Log
  },

  set g(x) {
    /^[ x ]/i.test(x)
      ? Log.compact(x)
      : Log.open(x)
  },

  join(a, b = '\n') {
    Log(a.join(b))
  },

  each() {
    Log.open(len(arguments))
    for (const a of arguments) {
      is.a(a)
        ? Log.each.apply(Log, a)
        : Log(a)
    }
    Log.end()
  },

  echo(s, ...a) {
    let x; let y; let i = 0
    let re = [ x = s.raw[ i ] ]

    Log.compact(x)
    for (; i < a.length;) {
      re = re.concat(x = a[ i++ ], y = s.raw[ i ])
      Log(x, y)
    }
    Log.end()
    return re
  },
})


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export function predicate(x) {
  return is.f(x)
    ? x
    : (a =>
      o => a.every(k =>
        o[ k ] === x[ k ]))(O.keys(x))
}

export function fill(i, cb = x => x) {
  // eslint-disable-next-line no-var
  for (var a = A(i); i--;) a[ i ] = cb(i)
  return a
}

export function range(i, step, start = 0) {
  const a = A(i)
  const cb = is.f(start)
    ? (x, i) => start(x, i)
    : x => start + x
  for (let x = i * step; i--;)
    a[ i ] = cb(x -= step, i)
  return a
}

export function Co(fn, ...argv) {
  let done; let value; let it = fn(...argv)
  return (...a) => {
    if (done) return
    ;({ done, value } = it.next(...a))
    done && console.log(END.description, 'the end is near!')
    return done
      ? END
      : value
  }
}

export function chop(it, n) {
  // eslint-disable-next-line no-var
  for (var tmp, re = [], i = 0; i < it.length; i++) {
    0 === i % n && re.push(tmp = [])
    tmp.push(it[ i ])
  }
  return re
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

use(O, {
  from, alias, get, use, def,
  get o() {
    return O.create(null)
  },
  get now() {
    return new Date
  },
})

use(A, {
  fill,
  chop,
  range,
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

use(A.prototype, {
  get head() {
    return this[ 0 ]
  },
  get tail() {
    return this.at(-1)
  },
  get uniq() {
    return A.from(new Set(this))
  },
  pluck(k) {
    return this.map(o => o[ k ])
  },
  invoke(k, ...a) {
    return this.map(is.f(k)
      ? o => k.apply(o, a)
      : o => o[ k ].apply(o, a))
  },
  where(x, ctx, one) {
    return this[ ctx === 1 || one === 1
      ? 'find'
      : 'filter' ](A.predicate(x), ctx)
  },
  remove(x, ctx) {          // eslint-disable-next-line no-var
    for (var I = 0, i = 0, re = [], cb = A.predicate(x); i < this.length; i++) {
      cb.call(ctx, this[ i ], i, this)
        ? re.push(this[ i ])
        : (this[ I++ ] = this[ i ])
    }
    this.length = I
    return re
  },
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

alias(Set.prototype, 'forEach', 'each')
alias(Map.prototype, 'forEach', 'each')
alias(A.prototype, 'forEach', 'each')
alias(A.prototype, 'includes', 'has')
alias(A.prototype, 'head', S.prototype)
alias(A.prototype, 'tail', S.prototype)
alias(A.prototype, 'uniq', S.prototype)
alias(S.prototype, 'includes', 'has')
alias(S.prototype, 'charCodeAt',  'code')
alias(S.prototype, 'codePointAt',  'point')
alias(S, 'fromCharCode', 'code')
alias(S, 'fromCodePoint', 'point')

alias(P, 'reject', 'deny')
alias(P, 'resolve', 'done')

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

use(P, {
  try(cb, ...a) {
    return new P((ok, nope) => {
      try {
        let re = cb(...a)
        ok(re)
      }
      catch (e) {
        nope(e)
      }
    })
  },

  as(cb, ...a) {
    return new P((ok, nope) =>
      cb(...a, (e, re) => e
        ? nope(e)
        : ok(re)))
  },
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

use(String.prototype, {
  get up() {
    return this.toUpperCase()
  },
  get low() {
    return this.toLowerCase()
  },
  rx(fl) {
    return new RegExp(this.replace(/( +)?\n+( +)?/g, ''), fl ?? '')
  },
  where(rx, cb = x => x) {
    return A.from(this.matchAll(rx), x => cb(x.groups ?? x))
  },
})

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

use(RegExp.prototype, {
  clone(fl) {
    return new RegExp(this.source, fl ?? this.flags)
  },
})


/*
  css: {

    clr(x) {
      return A.isArray(x)
        ? `rgb(${ x })`
        : x
    },

    u(x, y) {
      return +x === +x
        ? x + (y ?? 'px')
        : x
    },

    f(...a) { return 'font: ' + a.join(' ') },
    ff(x) { return 'font-family: ' + x },
    fs(x) { return 'font-size: ' + Log.css.u(x, 'em') },
    bg(x) { return 'background: ' + Log.css.clr(x) },
    c(x) { return 'color: ' + Log.css.clr(x) },
    p(...a) { return 'padding: ' + a.join(' ') },
    m(...a) { return 'margin: ' + a.join(' ') },
  },

  camel(s) {
    return s in Log.css
      ? Log.css(s)
      : s.replace(/([a-z])([A-Z])/g, (_, x, y) => x + '-' + y.toLowerCase())
  },

  styl(...a) {
    let args = []
    let tmpl = []

    for (let i = a.length; i--;) {
      let { type, value, ...css } = a[ i ]
      // re[ i ] = value

      if (!a[ i ].type) {
        type = typeof value
        if (type == 'number')
          type = 'd'
        else if (type == 'object')
          type = 'O'
        else
          type = 's'
      }


      let styl = O.entries(css).map(([ k, v ]) => Log.camel(k) + ': ' + v).join('; ')

      tmpl.push('%c%' + type)
      args.push(styl, value)
    }
    return lnk => Log(tmpl.join(lnk), ...args)
  },
 */
