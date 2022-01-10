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

export function mergeEnv(text, env = {}) {
  const lines = text.trim().split('\n')

  for (const line of lines) {
    const [ k, v ] = line.split('=').map(x => x.trim())
    if (!k || !v) {
      console.error('bad line', line)
      continue
    }

    if (k in env && env[ k ] !== v)
      console.log('override', k, v)
    env[ k ] = v
  }
  return env
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

