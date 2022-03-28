/* eslint-disable spaced-comment */
/* eslint-disable max-len */

import {
  BIKESHOP_DEBUG as DEBUG,
} from '../config/config.js'

import {
  format,
  inspect,
} from 'util'

const µ = null

export default function Log(s, ...a) {
  let args
  if (Array.isArray(s?.raw)) {
    args = [ s.raw[ 0 ] ]
    for (let i = 0; i < a.length;)
      args = args.concat(inspect(a[ i++ ]), s.raw[ i ])
  }
  console.log.apply(console, args ?? arguments)
}

use(Log, console)

Log.debug = debug
Log.table = console.table
Log.trace = console.trace
Log.error = console.error
Log.write = write.bind(µ, process.stdout)
Log.write.error = write.bind(µ, process.stderr)

function write(soc, s, ...a) {
  soc.write(s.raw[ 0 ])
  for (let i = 0; i < a.length;)
    soc.write(inspect(a[ i++ ]), s.raw[ i ])
  soc.write('\n')
}
Log`
❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰ DEBUG ❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰❰
${ DEBUG }
❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱ DEBUG ❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱❱
`

export function debug(prefix) {
  const head = randBgColor(prefix)
  const ok = DEBUG.includes(prefix) || DEBUG == '*'
  console.log('========== DEBUG LOG', DEBUG, ok
    ? '✅'
    : '⛔️', prefix, '\n==========')

  const fn = ok
    ? (s, ...a) => Log(head, format(s, ...a))
    : () => {}

  fn.error = ok
    ? (s, ...a) => Log.error(head, format(s, ...a))
    : () => {}
  return fn
}

function use(a, b) {
  return Object.defineProperties(a, Object.getOwnPropertyDescriptors(b))
}

function randBgColor(x) {
  const i = randBgColor.i++
  const n = randBgColor.pairs.length
  const [ a, b ] = randBgColor.pairs[ i % n ]
  return format(`\x1b[4%sm  \x1b[0m \x1b[4%sm  \x1b[0m %s`, a, b, x)
  // return format(`\x1b[4%sm[  \x1b[0m \x1b[4%sm  ]\x1b[0m %s ]`, a, b, x)
}

randBgColor.pairs = [
  /*
┌─────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┬─────────────────┐
│         │  black          │  red            │  green          │  yellow         │  blue           │  magenta        │  cyan           │  white          │
├─────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┼─────────────────┤
│   black ❯ */ [ 0, 0 ], /* │ */ [ 0, 1 ], /* │ */ [ 0, 2 ], /* │ */ [ 0, 3 ], /* │ */ [ 0, 4 ], /* │ */ [ 0, 5 ], /* │ */ [ 0, 6 ], /* │ */ [ 0, 7 ], /* │
│     red │ */ [ 1, 0 ], /* ❯ */ [ 1, 1 ], /* │ */ [ 1, 2 ], /* │ */ [ 1, 3 ], /* │ */ [ 1, 4 ], /* │ */ [ 1, 5 ], /* │ */ [ 1, 6 ], /* │ */ [ 1, 7 ], /* │
│   green │ */ [ 2, 0 ], /* │ */ [ 2, 1 ], /* ❯ */ [ 2, 2 ], /* │ */ [ 2, 3 ], /* │ */ [ 2, 4 ], /* │ */ [ 2, 5 ], /* │ */ [ 2, 6 ], /* │ */ [ 2, 7 ], /* │
│  yellow │ */ [ 3, 0 ], /* │ */ [ 3, 1 ], /* │ */ [ 3, 2 ], /* ❯ */ [ 3, 3 ], /* │ */ [ 3, 4 ], /* │ */ [ 3, 5 ], /* │ */ [ 3, 6 ], /* │ */ [ 3, 7 ], /* │
│    blue │ */ [ 4, 0 ], /* │ */ [ 4, 1 ], /* │ */ [ 4, 2 ], /* │ */ [ 4, 3 ], /* ❯ */ [ 4, 4 ], /* │ */ [ 4, 5 ], /* │ */ [ 4, 6 ], /* │ */ [ 4, 7 ], /* │
│ magenta │ */ [ 5, 0 ], /* │ */ [ 5, 1 ], /* │ */ [ 5, 2 ], /* │ */ [ 5, 3 ], /* │ */ [ 5, 4 ], /* ❯ */ [ 5, 5 ], /* │ */ [ 5, 6 ], /* │ */ [ 5, 7 ], /* │
│    cyan │ */ [ 6, 0 ], /* │ */ [ 6, 1 ], /* │ */ [ 6, 2 ], /* │ */ [ 6, 3 ], /* │ */ [ 6, 4 ], /* │ */ [ 6, 5 ], /* ❯ */ [ 6, 6 ], /* │ */ [ 6, 7 ], /* │
│   white │ */ [ 7, 0 ], /* │ */ [ 7, 1 ], /* │ */ [ 7, 2 ], /* │ */ [ 7, 3 ], /* │ */ [ 7, 4 ], /* │ */ [ 7, 5 ], /* │ */ [ 7, 6 ], /* ❯ */ [ 7, 7 ], /* │
└─────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┴─────────────────┘
*/
]

randBgColor.i = 0 | Math.random() * randBgColor.pairs.length
