import { inspect } from 'util'
import { Writable } from 'stream'
import { BIKESHOP_DEBUG as DEBUG } from '../config/config.js'

export default function Log(s) {
  if (s?.raw)
    write.apply(process.stdout, arguments)
  else
    console.log.apply(console, arguments)
}

Log.debug = debug
Log.write = write
Log.table = console.table
Log.trace = console.trace
Log.error = console.error

export function write(s, ...a) {
  const soc = Writable[ Symbol.hasInstance ](this) ? this : process.stdout
  soc.write(s.raw[ 0 ], 'utf-8')
  for (let i = 0; i < a.length;)
    soc.write(inspect(a[ i++ ]) + s.raw[ i ], 'utf-8')
  soc.write('\n')
}

const colors = [
  '🔴',   '🟠',   '🟡',   '🟢',  '🔵',   '🟣',   '⚫️',  '⚪️',   '🟤',
  '🔴🔴', '🟠🔴', '🟡🔴', '🟢🔴', '🔵🔴', '🟣🔴', '⚫️🔴', '⚪️🔴', '🟤🔴',
  '🔴🟠', '🟠🟠', '🟡🟠', '🟢🟠', '🔵🟠', '🟣🟠', '⚫️🟠', '⚪️🟠', '🟤🟠',
  '🔴🟡', '🟠🟡', '🟡🟡', '🟢🟡', '🔵🟡', '🟣🟡', '⚫️🟡', '⚪️🟡', '🟤🟡',
  '🔴🟢', '🟠🟢', '🟡🟢', '🟢🟢', '🔵🟢', '🟣🟢', '⚫️🟢', '⚪️🟢', '🟤🟢',
  '🔴🔵', '🟠🔵', '🟡🔵', '🟢🔵', '🔵🔵', '🟣🔵', '⚫️🔵', '⚪️🔵', '🟤🔵',
  '🔴🟣', '🟠🟣', '🟡🟣', '🟢🟣', '🔵🟣', '🟣🟣', '⚫️🟣', '⚪️🟣', '🟤🟣',
  '🔴⚫️', '🟠⚫️', '🟡⚫️', '🟢⚫️', '🔵⚫️', '🟣⚫️', '⚫️⚫️', '⚪️⚫️', '🟤⚫️',
  '🔴⚪️', '🟠⚪️', '🟡⚪️', '🟢⚪️', '🔵⚪️', '🟣⚪️', '⚫️⚪️', '⚪️⚪️', '🟤⚪️',
  '🔴🟤', '🟠🟤', '🟡🟤', '🟢🟤', '🔵🟤', '🟣🟤', '⚫️🟤', '⚪️🟤', '🟤🟤',
]
colors.i = 0
// ❯❯❯❯❯❯❯❯❯❯❯❯❯❯ DEBUG:LOG ❯❯❯❯❯❯❯❯❯❯❯❯❯❯
//                ${ DEBUG }
// ❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮❮

write`
============ DEBUG:LOG ============
    ${ DEBUG }
===================================
`
export function debug(prefix) {

  const head = `[${  colors[ colors.i++ % colors.length ] } ${ prefix }] `
  const ok = DEBUG.includes(prefix) || DEBUG == '*'

  write`[ DEBUG:LOG ] ${ ok ? '✅' : '⛔️' } ${ head }`

  // write.call(process.stdout, '========== DEBUG LOG', DEBUG, ok ? '✅' : '⛔️', prefix)

  const fn = ok
    ? (...a) => {
      process.stdout.write(head, 'utf-8')
      Log.apply(Log, a)
    }
    : () => {}

  return fn
}

/*
  '🟥',  '🟧',   '🟨',   '🟩',  '🟦',   '🟪',   '⬛️',  '⬜️',   '🟫',
  '🟥🟥', '🟧🟥', '🟨🟥', '🟩🟥', '🟦🟥', '🟪🟥', '⬛️🟥', '⬜️🟥', '🟫🟥',
  '🟥🟧', '🟧🟧', '🟨🟧', '🟩🟧', '🟦🟧', '🟪🟧', '⬛️🟧', '⬜️🟧', '🟫🟧',
  '🟥🟨', '🟧🟨', '🟨🟨', '🟩🟨', '🟦🟨', '🟪🟨', '⬛️🟨', '⬜️🟨', '🟫🟨',
  '🟥🟩', '🟧🟩', '🟨🟩', '🟩🟩', '🟦🟩', '🟪🟩', '⬛️🟩', '⬜️🟩', '🟫🟩',
  '🟥🟦', '🟧🟦', '🟨🟦', '🟩🟦', '🟦🟦', '🟪🟦', '⬛️🟦', '⬜️🟦', '🟫🟦',
  '🟥🟪', '🟧🟪', '🟨🟪', '🟩🟪', '🟦🟪', '🟪🟪', '⬛️🟪', '⬜️🟪', '🟫🟪',
  '🟥⬛️', '🟧⬛️', '🟨⬛️', '🟩⬛️', '🟦⬛️', '🟪⬛️', '⬛️⬛️', '⬜️⬛️', '🟫⬛️',
  '🟥⬜️', '🟧⬜️', '🟨⬜️', '🟩⬜️', '🟦⬜️', '🟪⬜️', '⬛️⬜️', '⬜️⬜️', '🟫⬜️',
  '🟥🟫', '🟧🟫', '🟨🟫', '🟩🟫', '🟦🟫', '🟪🟫', '⬛️🟫', '⬜️🟫', '🟫🟫',
*/

