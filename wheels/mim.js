import Path from 'path'
export const CT = 'content-type'
export const CL = 'content-length'
export const mime = init()

export function get(x, fallback = x) {
  return mime[ x ] ?? fallback
}

export function is(expected, actual) {
  if (typeof actual != 'string')
    actual = fromHead(actual, false)
  return actual
    ? get(expected) === actual
    : actual
}

export function fromHead(x, fallback = '') {
  return x?.get?.(CT)
      ?? x?.[ CT ] ?? fallback
}

/**
 * @example
 * fromFile('/a/b.c', 'css')
 *    -> text/styl
 *
 * fromFile('/dir/file', 'css')
 *
 * @param {string|URL} file
 * @param {string} [fallback]
 * @return {string}
 */
export function fromFile(file, fallback = '') {
  if (file instanceof URL)
    file = file.pathname
  const ex = Path.extname(file).slice(1)
  return ex
    ? get(ex, fallback)
    : fallback
}


function init() {
  const mm = Object.create(null)
  for (const line of `
    text/plain                         txt
    text/html                          html
    text/css                           css
    image/gif                          gif
    image/png                          png
    image/jpeg                         jpg  jpeg
    image/svg+xml                      svg  svgz
    image/x-icon                       ico
    font/woff                          woff woff2
    application/xml                    xml
    application/zip                    zip tar
    application/json                   json
    application/javascript             js
    application/octet-stream           bin dmg iso img
    multipart/form-data                form
    application/x-www-form-urlencoded  query
  `.trim().split(/\n+/g)) {
    const [ type, ...alias ] = line.match(/\S+/g)
    mm[ type ] = type
    for (let a of alias)
      mm[ a ] = type

  }

  return Object.freeze(mm)
}

export const {
  txt,  css,  html,
  ico,  svg,  woff,
  gif,  png,  jpg,
  xml,  json, js,
  bin,  zip,  form, query,
} = mime
