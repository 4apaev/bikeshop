// @ts-check
import Koa from 'koa'
import Http from 'http'

/** @typedef {(ctx: Koa.Context) => boolean } MatchRoute */
/** @typedef {(url: Koa.Middleware|RegExp|string, cb: import('./middleware.js').Mware) => void } Route */

/** @implements {Koa} */
export default class Router extends Koa {                               // eslint-disable-next-line brace-style
  /** @type {Route} */ get(url, cb)  { this.handle('GET', url, cb) }    // eslint-disable-next-line brace-style
  /** @type {Route} */ del(url, cb)  { this.handle('DELETE', url, cb) } // eslint-disable-next-line brace-style
  /** @type {Route} */ put(url, cb)  { this.handle('PUT', url, cb) }    // eslint-disable-next-line brace-style
  /** @type {Route} */ post(url, cb) { this.handle('POST', url, cb) }

  handle() {
    let func /** @type {Koa.Middleware} */ = null
    let argv /** @type {MatchRoute[]} */ = []

    for (const a of arguments) {
      if (typeof a == 'function')
        func = a

      else if (typeof a == 'string')
        argv.push(pathOrMethod(a))

      else if (RegExp[ Symbol.hasInstance ](a))
        argv.push(matchParams(a))
    }

    if (typeof func != 'function')
      throw new Error('missing route callback')

    this.use((ctx, next) =>
      argv.every(fn => fn(ctx))
        ? func(ctx, next)
        : next())
  }
}

/**
 * @param  {string} x
 * @param  {string} [k='path']
 * @return {Koa.Middleware}
 */
function pathOrMethod(x, k = 'path') {
  return Http.METHODS.includes(x.toUpperCase())
    ? (x => ctx => ctx.method == x)(x.toUpperCase())
    : ctx => ctx.path == x
}

/**
 * @param  {RegExp} rx
 * @return {MatchRoute}
 */
function matchParams(rx) {
  return ctx => {
    const match = ctx.path.match(rx)
    Object.assign(ctx.params, match?.groups)
    return !!match
  }
}
