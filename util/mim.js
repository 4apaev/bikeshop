export const CT = 'content-type'
export const CL = 'content-length'
export const mime = init()

/**
 * @callback stringer
 * @param  { string | URL } file
 * @param  {?string } [fallback]
 * @return { string }
 */

export function get(x, fallback = x) {
  return mime[ x ] ?? fallback
}

export function is(expected, actual) {
  if (typeof actual != 'string')
    actual = fromHead(actual, false)

  expected = get(expected, expected)
  return actual
    ? actual.includes(expected)
    : actual == expected
}

export function fromHead(x, fallback = '') {
  return x?.get?.(CT)
      ?? x?.[ CT ] ?? fallback
}

/**
 * @param {string|URL} file
 * @param {string} [fallback]
 * @return {string}
 */
export function fromFile(file, fallback = '') {
  const ex = extname(file)
  return ex
    ? get(ex, fallback)
    : fallback
}

/**
 * @param {string|URL} file
 * @param {string} [fallback]
 * @return {string}
 */
export function extname(file, fallback = '') {
  if (file instanceof URL)
    file = file.pathname

  let ex = ''
  for (let i = file.length; i--;) {
    if (file[ i ] == '.') break
    ex = file[ i ] + ex
  }
  return ex || fallback
}

function init() {
  const mm = Object.create(null)
  for (const line of `
    text/plain                         txt
    text/html                          html
    text/css                           css
    text/less                          less
    text/x-asm                         s asm
    text/x-sass                        sass
    text/x-scss                        scss
    text/csv                           csv
    text/jsx                           jsx
    text/x-markdown                    md
    text/yaml                          yaml yml
    text/xml                           xml

    image/gif                          gif
    image/png                          png
    image/jpeg                         jpg  jpeg
    image/svg+xml                      svg  svgz
    image/x-icon                       ico
    image/webp                         webp

    font/woff                          woff woff2
    font/opentype                  otf
    application/x-font-bdf         bdf
    application/x-font-otf         otf
    application/x-font-pcf         pcf
    application/x-font-snf         snf
    application/x-font-ttf         ttf ttc
    application/x-font-type1       pfa pfb pfm afm
    application/x-font-linux-psf   psf

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
