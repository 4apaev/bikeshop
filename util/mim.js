// @ts-check

/** @typedef {Object<string, string>} SDict */

export const CT = 'content-type'
export const CL = 'content-length'
export const mime /** @type {SDict} */ = {}

/**
 * @param  {string} x
 * @param  {any} [fallback]
 * @return {string}
 */
export function get(x, fallback = x) {
  return mime[ x ] ?? fallback
}

/**
 * @param {string} expected
 * @param {string | Headers | SDict} actual
 * @return {boolean}
 */
export function is(expected, actual) {
  if (typeof actual != 'string')
    actual = fromHead(actual, '')
  expected = get(expected, expected)
  return actual
    ? actual.includes(expected)
    : actual == expected
}

/**
 * @param {Headers | SDict} x
 * @param {string} [fallback='']
 * @return {string}
 */
export function fromHead(x, fallback = '') {
  const re = typeof x.get == 'function'
    ? x.get(CT)
    : x?.[ CT ]
  return re ?? fallback
}

/**
 * @param {string | URL} file
 * @param {string} [fallback = '']
 * @return {string}
 */
export function fromFile(file, fallback = '') {
  const ex = extname(file)
  return ex
    ? get(ex, fallback)
    : fallback
}

/**
 * @param {string | URL} file
 * @param {string} [fallback = '']
 * @return {string}
 */
export function extname(file, fallback = '') {
  if (file instanceof URL)
    file = file.pathname

  let ex = ''
  for (let i = file.length; i--;) {
    if (file[ i ] == '.')
      break
    ex = file[ i ] + ex
  }
  return ex || fallback
}

export const txt   = mime.txt   = 'text/plain'
export const html  = mime.html  = 'text/html'
export const css   = mime.css   = 'text/css'
export const less  = mime.less  = 'text/less'
export const csv   = mime.csv   = 'text/csv'
export const jsx   = mime.jsx   = 'text/jsx'
export const md    = mime.md    = 'text/x-markdown'
export const yaml  = mime.yaml  = 'text/yaml'
export const yml   = mime.yml   = 'text/yaml'
export const xml   = mime.xml   = 'text/xml'
export const gif   = mime.gif   = 'image/gif'
export const png   = mime.png   = 'image/png'
export const jpg   = mime.jpg   = 'image/jpeg'
export const jpeg  = mime.jpeg  = 'image/jpeg'
export const svg   = mime.svg   = 'image/svg+xml'
export const svgz  = mime.svgz  = 'image/svg+xml'
export const ico   = mime.ico   = 'image/x-icon'
export const webp  = mime.webp  = 'image/webp'
export const woff  = mime.woff  = 'font/woff'
export const otf   = mime.otf   = 'font/opentype'
export const bdf   = mime.bdf   = 'application/x-font-bdf'
export const pcf   = mime.pcf   = 'application/x-font-pcf'
export const snf   = mime.snf   = 'application/x-font-snf'
export const ttf   = mime.ttf   = 'application/x-font-ttf'
export const zip   = mime.zip   = 'application/zip'
export const tar   = mime.tar   = 'application/zip'
export const json  = mime.json  = 'application/json'
export const js    = mime.js    = 'application/javascript'
export const bin   = mime.bin   = 'application/octet-stream'
export const dmg   = mime.dmg   = 'application/octet-stream'
export const iso   = mime.iso   = 'application/octet-stream'
export const img   = mime.img   = 'application/octet-stream'
export const form  = mime.form  = 'multipart/form-data'
export const query = mime.query = 'application/x-www-form-urlencoded'
Object.freeze(mime)

