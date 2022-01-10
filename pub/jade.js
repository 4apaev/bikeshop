/* eslint-disable no-unused-vars */


const isi = Number.isInteger
const O = Object
const {
  entries,
  defineProperty: define,
  defineProperties: defines,
  getOwnPropertyDescriptors: get,
} = Object

export const oo = O.create.bind(O, null)

define(O, 'o', { get: oo })
export function Block(i, tag, parent) {

  const node = defines([ tag.trim() ], get({
    get i() {
      return i
    },
    get parent() {
      return parent
    },
  }))

  parent?.push(node)
  return node
}

export function yml(str = testString) {
  let prev, next
  const tree = Block(0, 'root')
  const buf = [ next = tree ]

  for (const line of str.trim().split('\n')) {
    const [ i, tag ] = index(line)

    if (i > next.i) {
      prev = next
      buf.push(next = Block(i, tag, prev))
    }
    else {
      prev = where(buf, [ 'i', i ])
      next = Block(i, tag, prev?.parent ?? prev)
    }
  }
  return tree
}

export function where(it, qry) {
  qry = entries(qry)
  for (let i = it.length; i--;) {
    if (qry.every(([ k, v ]) => it[ i ][ k ] === v))
      return it[ i ]
  }
}

export function index(s) {
  let i = s.length - s.trimStart().length
  isi(i /= 2) || raise('Bad Indent at line: ' + s)
  return [ i, s.trim() ]
}

export function stringify(o, n) {
  let seen = new WeakSet
  return JSON.stringify(o, (k, v) => Object(v) === v
    ? seen.has(v)
      ? undefined
      : (seen.add(v), v)
    : v, n ?? 2)
    .replace(/\s+\]/g, ']')
    .replace(/\[\s+/g, '[ ')
}

export function repl(s) {
  return s.replace(/( +)"(\w+)":/g, '$1$2:')
}



export function unquote(s) {
  return s.replace(/( +)"(\w+)":/g, '$1$2:')
}

export function dropCurly(s) {
  return s
    .replace(/\n +\},?/g, '')
    .replace(/ +\{\n/g, '')
}

export function raise(a, b) {
  throw new Error(a, b)
}

///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////


const set = (d, cew) => {
  d.enumerable = cew[ 0 ] ?? d.enumerable ?? 1
  d.configurable = cew[ 1 ] ?? d.configurable ?? 1
  d.get ?? (d.writable = cew[ 2 ] ?? d.writable ?? 1)
  return d
}

export function use() {
  let k; let o; let n; let d; let cew = []
  for (let a of arguments) {
    if ((k = (typeof a)[ 0 ]) == 's') n = a
    else if (k == 'n') cew.push(a)
    else if (o) d = a
    else o = a
  }

  o || raise('missing target object')
  d || raise('missing property descriptor')


  if (n)
    return define(o, n, set(d, cew))


  for (k in d) set(d, cew)
  return defines(o, d)
}



export const testString = `
head
  img
    /one/logo.png
  h1
    hello
  nav
    a login
    a logout
aside
  button.toggle
  nav
    a /one
    a /two
main
  h2 world
  tabs
    nav
      a /one/one
      a /one/two
    tab.one-one
      h3
        title
      p
        content
    tab.one-two
      h3
        label
      article
        text
`
