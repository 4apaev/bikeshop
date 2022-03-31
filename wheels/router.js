// @ts-check
import Koa from 'koa'
import Http from 'http'
import { Is } from '../util/index.js'

export default class Router extends Koa {
  /** @type {Route} */
  get(url, cb) {
    this.mware('GET', url, cb)
  }

  /** @type {Route} */
  del(url, cb) {
    this.mware('DELETE', url, cb)
  }

  /** @type {Route} */
  put(url, cb) {
    this.mware('PUT', url, cb)
  }

  /** @type {Route} */
  post(url, cb) {
    this.mware('POST', url, cb)
  }

  mware() {

    /** @type {Koa.Middleware} */ let cb
    const argv /** @type {isRoute[]} */ = []

    for (const a of arguments) {
      if (typeof a == 'function') {
        cb = a
      }
      else if (typeof a == 'string') {
        argv.push(isHttpMethod(a)
          ? ctx => ctx.method === a.toUpperCase()
          : ctx => ctx.path === a)
      }
      else if (RegExp[ Symbol.hasInstance ](a)) {
        argv.push(rxparams(a))
      }
    }

    Is.assert.f(cb, 'missing route callback')

    this.use(/** @type {Koa.Middleware} */ (ctx, next) =>
      argv.every(fn => fn(ctx))
        ? cb(ctx, next)
        : next())
  }
}

/**
 * @param  {RegExp} rx
 * @return {isRoute}
 */
export function rxparams(rx) {
  // rx.global || (rx = new RegExp(rx.source, 'g'))
  return ctx => {
    const match = ctx.path.match(rx)
    Object.assign(ctx.params, match?.groups)
    return !!match
  }
}

/**
 * @param  {string} str
 * @return {isRoute}
 */
export function rxpath(str) {
  const rx = new RegExp(str
      .replace(/:(\w+)/g, `(?<$1>w+)`)
      .replace(/(?<!\\)\//g, `\\/`)
      .replace(/(?<!\\)\b[wsdb][+*?]/gi, `\\$&`), 'g')
  return rxparams(rx)
}

/**
 * @param  {string} x
 * @return {boolean}
 */
function isHttpMethod(x) {
  return Http.METHODS.includes(x.toUpperCase())
}

/**
 * @callback Route
 * @param  {Koa.Middleware|RegExp|string} url
 * @param  {Koa.Middleware} [cb]
 *//**
 * @callback isRoute
 * @param  {Koa.Context} ctx
 * @return {boolean}
 */
