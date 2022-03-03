// @ts-check
import Koa from 'koa'
import Http from 'http'
import { O, Is } from '../util/index.js'

export default class Router extends Koa {
  /**
   * @param { string | RegExp | Koa.Middleware } url
   * @param { Koa.Middleware } [cb]
   */
  get(url, cb) {
    this.mware('GET', url, cb)
  }

  /**
   * @param { string | RegExp | Koa.Middleware } url
   * @param { Koa.Middleware } [cb]
   */
  del(url, cb) {
    this.mware('DELETE', url, cb)
  }

  /**
   * @param { string | RegExp | Koa.Middleware } url
   * @param { Koa.Middleware } [cb]
   */
  put(url, cb) {
    this.mware('PUT', url, cb)
  }

  /**
   * @param { string | RegExp | Koa.Middleware } url
   * @param { Koa.Middleware } [cb]
   */
  post(url, cb) {
    this.mware('POST', url, cb)
  }

  mware() {
    /** @type { Koa.Middleware } */
    let cb

    /** @type { isRoute[] } */
    const argv = []

    for (const a of arguments) {
      if (Is.f(a)) {
        cb = a
      }

      // @ts-ignore
      else if (Is(RegExp, a)) {
        argv.push(rxparams(a))
      }

      else if (Is.s(a)) {
        argv.push(isHttpMethod(a)
          ? ctx => ctx.method === a.up
          : ctx => ctx.path === a)
      }
    }

    // @ts-ignore
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
    O.assign(ctx.params, match?.groups)
    return !!match
  }
}

/**
 * @param { string } str
 * @return { isRoute }
 */
export function rxpath(str) {
  const rx = new RegExp(str
      .replace(/:(\w+)/g, `(?<$1>w+)`)
      .replace(/(?<!\\)\//g, `\\/`)
      .replace(/(?<!\\)\b[wsdb][+*?]/gi, `\\$&`), 'g')
  return rxparams(rx)
}

/**
 * @param { string } x
 * @return { boolean }
 */
function isHttpMethod(x) {
  return Http.METHODS.includes(x.toUpperCase())
}

/**
 * @callback Route
 * @param {string | RegExp | Koa.Middleware} url
 * @param {Koa.Middleware} [cb]
 * @return {boolean}
 *//**
 * @callback isRoute
 * @param {Koa.Context} ctx
 * @return {boolean}
 */
