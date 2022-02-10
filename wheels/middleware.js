// @ts-check
import Koa from 'koa'
import * as Mim from '../util/mim.js'
import { Log } from '../util/index.js'

const debug = Log.debug('middleware')

export const methods = new Set([
  'POST',
  'PUT',
  'PATHCH',
  'DELETE',
])

/** @type {Koa.Middleware} */
export async function logger(ctx, next) {
  const start = Date.now()
  await next()
  Log('%d %s %s %s', ctx.status, ctx.method, ctx.path, Date.now() - start)
}

/** @type {Koa.Middleware} */
export async function reqPayload(ctx, next) {
  if (!methods.has(ctx.method))
    return next()

  const payload = []

  for await (const chunk of ctx.req)
    payload.push(chunk)

  ctx.payload = Buffer.concat(payload).toString()
  return parsePayload(ctx, next)
}

/** @type {Koa.Middleware} */
function parsePayload(ctx, next) {
  if (!ctx.is(Mim.json))
    return next()

  if (ctx.payload.length < 2) {
    ctx.payload = {}
    debug('payload to small %s:', ctx.req.headers[ 'content-length' ])
    return next()
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
