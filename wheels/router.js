// @ts-check
import Koa from 'koa'
import Http from 'http'
import {
  Is,
} from '../util/index.js'

/** @typedef {import("koa").Context} Ctx */

/** @typedef {import("koa").Middleware} MWare */

/**
 * @callback isRoute
 * @param {Ctx} ctx
 * @return {boolean}
 */

/**
 * @callback Route
 * @param { string | RegExp } url
 * @param { MWare } cb
 */

export default class Router extends Koa {
  /**
   * @type {Route}
   * @param {string} url

   */
  get(url, cb) {
    this.mware('GET', url, cb)
  }

  /**
   * @param { string | RegExp } url
   * @param { MWare } cb
   */
  del(url, cb) {
    this.mware('DELETE', url, cb)
  }

  /**
   * @param {string|RegExp} url
   * @param {MWare} cb
   */
  put(url, cb) {
    this.mware('PUT', url, cb)
  }

  /**
   * @param {string|RegExp} url
   * @param {MWare} cb
   */
  post(url, cb) {
    this.mware('POST', url, cb)
  }

  /**
   * @param {string|RegExp} url
   * @param {MWare} cb
   */
  patch(url, cb) {
    this.mware('PATCH', url, cb)
  }

  mware() {
    /** @type {MWare} */
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

    this.use(/** @type {MWare} */ (ctx, next) =>
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

