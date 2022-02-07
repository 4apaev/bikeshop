/* eslint-disable no-unused-vars */
// @ts-check
import Koa from 'koa'
import Http from 'http'
import {
  Is,
  Log,
} from '../util/index.js'

/**
 * @callback Route
 * @param { string | RegExp } url
 * @param { Koa.Middleware } cb
 */

/**
 * @callback isRoute
 * @param {Koa.Context} ctx
 * @return {boolean}
 */

export default class Router extends Koa {
  /**
   * @param { string | RegExp } url
   * @param { Koa.Middleware } cb
   */
  get(url, cb) {
    this.mware('GET', url, cb)
  }

  /**
   * @param { string | RegExp } url
   * @param { Koa.Middleware } cb
   */
  del(url, cb) {
    this.mware('DELETE', url, cb)
  }

  /**
   * @param {string|RegExp} url
   * @param {Koa.Middleware} cb
   */
  put(url, cb) {
    this.mware('PUT', url, cb)
  }

  /**
   * @param {string|RegExp} url
   * @param {Koa.Middleware} cb
   */
  post(url, cb) {
    this.mware('POST', url, cb)
  }

  /**
   * @param {string|RegExp} url
   * @param {Koa.Middleware} cb
   */
  patch(url, cb) {
    this.mware('PATCH', url, cb)
  }

  mware() {
    /** @type {Koa.Middleware} */
    let cb

    /** @type {isRoute[]} */
    const argv = []

    for (const a of arguments) {
      if (Is.f(a))
        cb = a
      else if (Is(RegExp, a))
        argv.push(ctx => a.test(ctx.path))

      else if (Is.s(a)) // eslint-disable-next-line multiline-ternary
        argv.push(isHttpMethod(a) ? ctx => ctx.method === a.up : rxpath(a))
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
 * @param {string} str
 * @return {isRoute}
 */
export function rxpath(str) {
  const rx = new RegExp(str
    .replace(/:(\w+)/g, `(?<$1>w+)`)
    .replace(/(?<!\\)\//g, `\\/`)
    .replace(/(?<!\\)\b[wsdb][+*?]/gi, `\\$&`), 'g')

  return ctx => {
    for (const x of ctx.path.matchAll(rx)) {
      ctx.params = x?.groups ?? {}
      return true
    }
    return false
  }
}

/**
 * @param {string} x
 * @return {boolean}
 */
function isHttpMethod(x) {
  return Http.METHODS.includes(x.toUpperCase())
}

Log(rxpath('/define.js'))
