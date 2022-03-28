import O from './define.js'
import Is from './is.js'
import Log from './log.js'
import Fail from './fail.js'

export {
  O,
  Is,
  Log,
  Fail,
}

export const echo = x => x
export function sanitizePath(x) {
  return x.split('/').reduce((prev, next) => {
    if (next == '..')
      prev.pop()
    else if (next != '.')
      prev.push(next)
    return prev
  }, []).join('/')
}

export function tmpl(s, a, cb = x => x) {
  let re = [ s.raw[ 0 ] ]
  for (let i = 0; i < a.length;)
    re = re.concat(cb(a[ i++ ]), s.raw[ i ])
  return re
}

export function str2rgx(s, ...a) {
  let fl = ''
  let rx = tmpl(s, a, x => Is(RegExp, x)
    ? x.source
    : x).join('')
  rx = rx.replace(/( +)?\n+( +)?/g, '')
  rx = rx.replace(/\/([gimdsuy]+)\/?$/, (_, f) => echo('', fl += f))
  return new RegExp(rx, fl)
}

O(tmpl, {
  raw(s, ...a) {
    return tmpl(s, a).join('')
  },
})

O(Array, {
  is(x) {
    return Array.isArray(x)
  },

  fill(i, cb = x => x) {
    const a = Array(i)
    for (; i--;) a[ i ] = cb(i)
    return a
  },
})

O(Array.prototype, {
  has(x) {
    return this.includes(x)
  },
  get head() {
    return this[ 0 ]
  },
  get tail() {
    return this.at(-1)
  },
  get uniqe() {
    return Array.from(new Set(this))
  },
})

O(String, {
  rx: str2rgx,
  is(x) {
    return typeof x == 'string'
  },
})

O(String.prototype, {
  get up() {
    return this.toUpperCase()
  },

  get low() {
    return this.toLowerCase()
  },

  pad(n, x = ' ') {
    let fl = 0; let s = String(this)
    while (n > s.length) {
      s = (fl ^= 1)
        ? s + x
        : x + s
    }
    return s
  },
})

O.alias(Array.prototype, String.prototype, 'head')
O.alias(Array.prototype, String.prototype, 'tail')
