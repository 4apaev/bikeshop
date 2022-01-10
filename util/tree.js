/* eslint-disable no-unused-vars */

const O = Object
const S = String
const A = Array

const kid = 'children'
const dad = 'parent'
const val = 'tag'
const tab = 'i'

O.use = (a, b) =>
  O.defineProperties(a, O.getOwnPropertyDescriptors(b))

O.use(O, {
  get o() {
    return O.create(null)
  },
  from(x) {
    return Symbol.iterator in O(x)
      ? O.fromEntries(x)
      : O.entries(x)
  },
})

function Block(i) {
  return O.assign(O.o, {
    [ tab ]: i,
    [ dad ]: null,
    [ val ]: [],
    [ kid ]: [],
  })
}

export default function parse(str) {
  let prev
  let root = Block(0)
  let curr = root
  let blocks = []

  const add = (a, b) => {
    blocks.push(b)
    a[ kid ].push(b)
    b[ dad ] = a
  }

  for (const line of str.trim().split('\n')) {
    const i = findIndex(line)

    if (i > curr[ tab ]) {
      prev = curr
      curr = Block(i)
      add(prev, curr)
    }
    else {
      prev = findParent(i, blocks, line)
      curr = Block(i)
      add(prev[ dad ], curr)
    }

    curr[ val ] += line.trim()
  }
  return { root, blocks }
}

function findParent(indent, blocks) {
  for (let i = blocks.length; i--;) {
    if (blocks[ i ][ tab ] === indent)
      return blocks[ i ]
  }
  raise(`parent: ${ indent } not found`)
}

function findIndex(line) {
  for (let i = 0; i < line.length; i++) {
    if (line[ i ].charCodeAt() > 0x20) {
      Number.isInteger(i /= 2) || raise('Bad Indent at line: ' + line)
      return i
    }
  }
}

function raise(m) {
  throw new Error(m)
}







