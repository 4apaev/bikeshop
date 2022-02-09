// @ts-check
import { Log } from '../util/index.js'

/** @typedef {import("koa").Context} Context */
/** @typedef {import("koa").Middleware} Middleware */
/** @typedef {import("../db/db.js").QRes} QRes */

/**
 * @typedef {Object} Opts
 * @prop {string} msg
 * @prop {number} [code]
 * @prop {(ctx: Context) => *} [before]
 * @prop {function} [validate]
 * @prop {function} [after]
 * @prop {function} [debug]
 */

/**
 * @param {{(payload: *): Promise<QRes> }} fn
 * @param {Opts} opt
 */
export default function respond(fn, opt) {
  const before = opt.before ??= ctx => ctx.payload
  const after = opt.after ??= x => x
  const debug = opt.debug ??= Log.debug('[service:respond]')
  const code = opt.code ??= 400
  const check = opt.validate

  return /** @type {Middleware} */ async ctx => {
    ctx.type = 'json'

    let payload = before(ctx)
    let message = check
      ? check(payload)
      : null

    if (message) {
      ctx.status = 400
      ctx.body = { error: true, message }
      return debug(message)
    }

    const {
      error,
      value,
      result,
    } = await fn(payload)

    // TODO return better response for 404 (no value in not an rror!)
    if (error) {
      ctx.status = error
        ? code
        : 404

      message = error
        ? String(error)
        : opt.msg

      ctx.body = { error: true, message }
      debug(ctx.body.message, error ?? result)
    }
    else {
      ctx.status = 200
      ctx.body = {
        error: false,
        value: after(value),
      }
    }
  }
}
