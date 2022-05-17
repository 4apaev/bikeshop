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
 * @return {Middleware}
*/
export default function request(title, fn) {
  return async (/** @type {Context} */ ctx) => {
    ctx.status = 200
    ctx.type = 'json'
    // debug('before Try')
    try {
      const { error, value, code } = await fn(ctx)
      ctx.status = code ?? 200
      ctx.body = { error, value }
      // debug('ok')
    }
    catch (e) {
      debug(title, e)
      ctx.status = e.code ?? 500
      ctx.body = { error: e }
    }
  }
}

/**
 * @typedef {import('koa').Middleware} Middleware               *//**
 * @typedef {import('koa').Context} Context                     *//**
 * @typedef {{ error?: Error, value?: any, code?: number }} Res *//**
 * @typedef {(ctx: Context) => Promise<Res>} Req                */
