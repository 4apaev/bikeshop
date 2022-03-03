const links = {
  Object: ':',
  Array: '-',
  Set: '=',
  Map: '=',
}

function Block(i, tag = '❎', parent) {
  const b = [ tag.trim() ]
  set(b, 'i', i)
  set(b, 'tag', tag)
  set(b, 'parent', parent)
  parent?.push(b)
  return b
}

export default function Yaml(str, ...argv) {
  if (Array.isArray(str.raw))
    str = String.raw(str, ...argv)

  let prev
  let tree = Block(0, 'tree')
  let curr = tree
  let blocks = [ curr ]

  for (const line of str.split(/\n+/g)) {
    let i = line.length - line.trimStart().length
    let tag = line.trim()
    if (tag.length === 0)
      continue

    if (!Number.isInteger(i /= 2))
      throw new SyntaxError(`Bad Indent at line: [${ i }, ${ line }]`)

    if (i > curr.i) {
      prev = curr
      blocks.push(curr = Block(i, tag, prev))
    }
    else {
      prev = blocks.findLast(b => b.i === i)
      curr = Block(i, tag, prev?.parent ?? prev)
    }
  }
  return tree.slice(1)
}

Yaml.format = format
export function format(x) {
  return stringify(x, new WeakSet, [], []).join('\n')
}

function stringify(x, seen, path, re, prev) {
  re ??= []
  path ??= []
  seen ??= new WeakSet

  const next = toString.call(x).slice(8, -1)

  if (next in links) {
    if (seen.has(x)) return re

    seen.add(x)

    prev && re.push(resolve('', path, links[ prev ]))

    if (next == 'Array' || next == 'Set') {
      for (let v of x)
        stringify(v, seen, path.concat(''), re, next)
    }
    else {
        // for (let [ k, v ] of x?.entries?.() ?? Object.entries(x))
      for (let k in x)
        stringify(x[ k ], seen, path.concat(k), re, next)
    }
  }
  else {
    re.push(resolve(x, path, links[ prev ]))
  }
  return re
}

function resolve(x, path, link = '~', tab = '  ') {
  let n = path.length
  let k = path[ n - 1 ] ?? ''
  return tab.repeat(n) + k + link + ' ' + x
}

function set(a, b, c) {
  return Object.defineProperty(a, b, {
    get() {
      return c
    },
  })
}
