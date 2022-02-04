// @ts-check
import Koa from 'koa'
import Http from 'http'

/**
 * @callback Route
 * @param { string | RegExp } url
 * @param { Koa.Middleware } cb
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
    const argv = []
    let cb

    for (const a of arguments) {
      if (typeof a == 'function') {
        cb = a
      }
      else if (a instanceof RegExp) {
        argv.push((/** @type {Koa.Context} */ ctx) => a.test(ctx.path))
      }
      else if (typeof a == 'string') {
        if (isHttpMethod(a))
          (x => argv.push((/** @type {Koa.Context} */ ctx) => ctx.method === x))(a.toUpperCase())
        else
          argv.push((/** @type {Koa.Context} */ ctx) => ctx.path === a)
      }
    }

    typeof cb == 'function' || raise('missing route callback')

    this.use(/** @type {Koa.Middleware} */ (ctx, next) =>
      argv.every(fn => fn(ctx))
        ? cb(ctx, next)
        : next())
  }
}

/**
 * @param {string} x
 * @return {boolean}
 */
function isHttpMethod(x) {
  return Http.METHODS.includes(x.toUpperCase())
}

/**
 * @param {string} x
 * @throws {Error}
 */
function raise(x) {
  throw new Error(x)
}
