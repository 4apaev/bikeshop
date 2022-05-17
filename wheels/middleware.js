// @ts-check
import Log from '../util/log.js'
import * as format from '../util/date.js'
const debug = Log.debug('middleware')

/** @typedef {import("koa").Context} Context */
/** @typedef {import("http-errors").HttpError} HttpError */
/** @typedef {import("koa").Middleware} Middleware */

export const methods = new Set([
  'POST',
  'PUT',
  'PATHCH',
  'DELETE',
])

/** @type {Middleware} */
export async function logger(ctx, next) {
  const start = format.now()
  ctx.params = {}

  try {
    await next()
    debug(
      '%s %d %s %s %dms',
      format.date(),
      ctx.status,
      ctx.method,
      ctx.path, // @ts-ignore
      format.now(start))
  }
  catch (e) {
    ctx.status = e.status ?? e.code ?? 500
    ctx.type = 'json'
    ctx.body = {
      error: true,
      message: e.message,
    }
    ctx.app.emit('error', e, ctx)
  }
}

/** @type {Middleware} */
export function echo(ctx) {
  ctx.status = 200
  debug('HEALTCHECK', ctx.body = format.uptime().join())
}

/** @type {Middleware} */
export async function reqPayload(ctx, next) {
  if (methods.has(ctx.method)) {
    let body = []

    for await (const chunk of ctx.req)
      body.push(chunk)

    // @ts-ignore
    ctx.request.body = body = Buffer.concat(body).toString()

    if (ctx.is('json')) {
      try {
        // @ts-ignore
        ctx.request.body = JSON.parse(body)
        // debug('🧳 after parse')
      }
      catch (e) {
        ctx.throw(400, 'Payload: Invalid JSON')
      }
    }
  }
  // debug('🧳 before next')
  await next()
}

/**
 * @param {HttpError} e
 * @param {Context} ctx
 */
export function onError(e, ctx) {
  const { status, method, path } = ctx
  const { name, message, code = e.status ?? 0 } = e
  Log.error('└ 🚨 [ %s: %d ] %s', name, code, message)
  Log.table({ code, status, method, path, name, message })
}
