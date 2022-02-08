// @ts-check
import * as Mim from './mim.js'
import { Log } from '../util/index.js'

/** @typedef {import("koa").Context} Ctx */
/** @typedef {import("koa").Middleware} MWare */

// @ts-ignore
const debug = Log.debug('middleware')

export const methods = new Set([
  'POST',
  'PUT',
  'PATHCH',
  'DELETE',
])

/** @type {MWare} */
export async function logger(ctx, next) {
  const start = Date.now()
  await next()
  Log('%d %s %s %s', ctx.status, ctx.method, ctx.path, Date.now() - start)
}

/** @type {MWare} */
export async function reqPayload(ctx, next) {
  if (!methods.has(ctx.method))
    return next()

  const payload = []

  for await (const chunk of ctx.req)
    payload.push(chunk)

  ctx.payload = Buffer.concat(payload).toString()
  return parsePayload(ctx, next)
}

/** @type {MWare} */
function parsePayload(ctx, next) {
  if (!ctx.is(Mim.json))
    return next()

  if (ctx.payload.length < 2) {
    // @ts-ignore
    return next(ctx.payload = {}, debug(
      '[payload: to small] %s:',
      ctx.req.headers[ 'content-length' ],
      ctx.payload))
  }

  try {
    ctx.payload = JSON.parse(ctx.payload)
    next()
  }
  catch (e) {
    debug('[payload]', 'Invalid JSON')
    ctx.status = 400
    ctx.body = {
      error: true,
      message: 'Invalid JSON',
    }
  }
}
