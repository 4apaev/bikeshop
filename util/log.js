import {
  format,
  inspect,
} from 'util'

const { BIKESHOP_DEBUG: DEBUG = '*' } = process.env
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

export function debug(prefix) {
  const head = randBgColor(prefix)
  const ok = DEBUG == '*' || DEBUG.includes(prefix)

  const fn = ok
    ? (s, ...a) => Log(head, format(s, ...a))
    : () => {}
  fn.error = ok
    ? (s, ...a) => Log.error(head, format(s, ...a))
    : fn
  return fn
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

/*

//var sketch = require('sketch')

console.log('This is an example Sketch script.')

var document = sketch.getSelectedDocument()

var selectedLayers = document.selectedLayers
var selectedCount = selectedLayers.length

if (selectedCount === 0) {
  console.log('No layers are selected.')
} else {
  console.log('Selected layers:');
  selectedLayers.forEach(function (layer, i) {
    console.log((i + 1) + '. ' + layer.name)
  })
}

*/
