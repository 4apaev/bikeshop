import {
  format,
  inspect,
} from 'util'

const { BIKESHOP_DEBUG: DEBUG = '*' } = process.env
const debuggers = new Set

export default function Log(s, ...a) {
  if (isRaw(s)) {                                        // eslint-disable-next-line no-var
    for (var i = 0, args = [ s.raw[ i ] ]; i < a.length;)
      args = args.concat(inspect(a[ i++ ]), s.raw[ i ])
    console.log.apply(console, args)
  }
  else {
    console.log.apply(console, arguments)
  }
}

use(Log, console)
use(Log, {
  format,
  inspect,

  get reset() {
    process.stdout.write(`\x1b[0m`)
    return Log
  },

  write(s, ...a) {
    if (isRaw(s)) {
      for (let i = 0; i < a.length; i++)
        process.stdout.write(s.raw[ i ], inspect(a[ i ]))
      process.stdout.write(s.raw.at(-1))
    }
    else {
      process.stdout.write(format(s, ...a))
    }
    process.stdout.write('\n')
  },

  debug(prefix) {
    debuggers.add(prefix)
    const head = randBgColor(prefix)
    return DEBUG == '*' || DEBUG.includes(prefix)
      ? (s, ...a) => Log(head, format(s, ...a))
      : () => {}
  },
})

export function getDebuggers(ctx) {
  ctx.status = 200
  ctx.type = 'json'
  ctx.body = [ ...debuggers ]
}

function isRaw(x) {
  return Array.isArray(x?.raw)
}

function use(a, b) {
  return Object.defineProperties(a, Object.getOwnPropertyDescriptors(b))
}

function randBgColor(x) {
  const [ a, b ] = randBgColor.pairs[ randBgColor.i++ % randBgColor.pairs.length ]
  return format(`\x1b[%sm\x1b[%sm %s \x1b[0m`, a, b, x)
}

randBgColor.pairs = [                                                                             // eslint-disable indent
  [ 40, 31 ], [ 40, 32 ], [ 40, 33 ], [ 40, 34 ], [ 40, 35 ], [ 40, 36 ], [ 40, 37 ],             // eslint-disable indent
  [ 41, 30 ],             [ 41, 32 ], [ 41, 33 ], [ 41, 34 ],             [ 41, 36 ], [ 41, 37 ], // eslint-disable indent
  [ 42, 30 ], [ 42, 31 ],             [ 42, 33 ], [ 42, 34 ], [ 42, 35 ],             [ 42, 37 ], // eslint-disable indent
  [ 43, 30 ], [ 43, 31 ], [ 43, 32 ],             [ 43, 34 ], [ 43, 35 ], [ 43, 36 ],             // eslint-disable indent
  [ 44, 30 ], [ 44, 31 ], [ 44, 32 ], [ 44, 33 ],                         [ 44, 36 ], [ 44, 37 ], // eslint-disable indent
  [ 45, 30 ],             [ 45, 32 ], [ 45, 33 ], [ 45, 34 ],             [ 45, 36 ], [ 45, 37 ], // eslint-disable indent
  [ 46, 30 ], [ 46, 31 ],             [ 46, 33 ], [ 46, 34 ], [ 46, 35 ],             [ 46, 37 ], // eslint-disable indent
  [ 47, 30 ], [ 47, 31 ], [ 47, 32 ],             [ 47, 34 ], [ 47, 35 ], [ 47, 36 ],
]

randBgColor.i = 0 | Math.random() * randBgColor.pairs.length; [
  'Black', 'red',
  'green', 'yellow',
  'blue',  'magenta',
  'cyan',  'white',
].forEach((c, i) => {
  let a = c[ 0 ]
  let b = c.toLowerCase()
  Log[ a ] = Log[ b ] = Log.bind(console, `\x1b[3${ i }sm%s\x1b[39m`)
})

