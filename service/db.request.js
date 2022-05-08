// @ts-check
import Log from '../util/log.js'
import Fail from '../util/fail.js'

const debug = Log.debug('service.request')

/**
 * @param {any} x
 * @param {number} code
 * @param {string} message
 * @throws {Fail}
 */
export function assert(x, code, message) {
  if (!x)
    throw new Fail(message, { code })
}

/**
 * @param  {string} title
 * @param  {Req} fn
 * @return {Mware}
*/
export default function request(title, fn) {
  return async (/** @type {Context} */ ctx) => {
    ctx.type = 'json'
    try {
      const { error, value, code } = await fn(ctx)
      ctx.body = { error, value }
      ctx.status = code ?? 200
    }
    catch (e) {
      debug(title, e)
      ctx.body = { error: e }
      ctx.status = e.code ?? 500
    }
  }
}

/**
 * @typedef {import('koa').Middleware} Mware
 */

/**
 * @typedef {import('koa').Context} Context
 */

/**
 * @typedef {{ error?: Error, value?: any, code?: number }} Res
 */

/**
 * @typedef {(ctx: Context) => Promise<Res>} Req
 */
