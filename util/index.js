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

export const {
  raise,
  assert,
  trace,
  deny,
  Try,
} = Fail

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
  if (!Is.a(s?.raw))
    return

  let re = [ s.raw[ 0 ] ]
  for (let i = 0; i < a.length;)
    re = re.concat(cb(a[ i++ ]), s.raw[ i ])
  return re
}
tmpl.raw = (s, ...a) => tmpl(s, a).join('')

export function fill(i, cb = x => x) {
  const a = Array(i)
  for (; i--;) a[ i ] = cb(i)
  return a
}

export function uniqe() {
  return Array.from(new Set(this))
}

export function rgx(s) {
  let fl = ''
  return new RegExp((Is.a(s?.raw)
    ? String.raw.apply(String, arguments)
    : s)
      .replace(/( +)?\n+( +)?/g, '')
      .replace(/\/([gimdsuy]+)\/?$/, (_, f) => (
        fl += f, '')), fl)
}

