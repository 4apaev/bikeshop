const $ = Symbol('Default Args')

export default function parse(args) {
  let k = $
  const o = {}

  for (let i = 0; i < args.length; i++) {
    let v = args[ i ]
    if (v.startsWith('-')) {
      fix(o, k);
      [ k, v ] = v.match(/[^-=\s]+/g)
    }

    if (v != null) {
      v = formatValue(unquote(v))
      if (Array.isArray(o[ k ])) {
        o[ k ].push(v)
      }
      else {
        o[ k ] = o[ k ] == null
          ? v
          : [ o[ k ], v ]
      }
    }
  }

  fix(o, k)
  const defaultArgs = o[ $ ]
  delete o[ $ ]
  return [ o, defaultArgs ]
}

export function mergeEnv(str) {
  let re = {}
  let prev = undefined

  for (let next of str.split(/\n+/g)) {
    if ((next = next.trim()).length === 0)
      continue

    let [ k, v ] = next.split('=').map(s => s.trim())

    if (v) {
      prev = undefined
      if (k in process.env)
        console.log('override', k, v)

      re[ k ] = process.env[ k ] = v
    }
    else if (prev) {
      re[ prev ].push(k)
      process.env[ prev ] = re[ prev ]
    }
    else {
      prev = k
      if (k in process.env)
        console.log('override', prev)
      process.env[ prev ] = re[ prev ] = []
    }
  }
  return process.env
}

function fix(o, k) {
  return k != $ && o[ k ] == null && (o[ k ] = true)
}

function formatValue(s) {
  return s == 'true'
    ? true
    : s == 'false'
      ? false
      : Number.isNaN(+s)
        ? s
        : +s
}

function unquote(s) {
  return s.trim().replace(/^("|'|`)(.*)\1$/, '$2')
}

