// @ts-check
import * as Mim from '../util/mim.js'
import { O, Is, Log } from '../util/index.js'
import * as format from '../util/date.js'
import crypto from 'crypto'

const debug = Log.debug('middleware')

/**
 * @typedef {import("koa").Middleware} Mware
 */

export const methods = new Set([
  'POST',
  'PUT',
  'PATHCH',
  'DELETE',
])

/** @type {Mware} */
export async function logger(ctx, next) {
  const start = Date.now() // @ts-ignore
  ctx.params = O.o
  ctx.id = crypto.randomUUID()

  await next()
  debug('%s %d %s %s %s',
    format.date(start),
    ctx.status,
    ctx.method,
    ctx.path,
    Date.now() - start)
}

/** @type {Mware} */
export function echo(ctx) {
  let { payload = {}} = ctx
  if (Is.not.o(payload))
    payload = { payload }
  payload.uptime = format.period(process.uptime() * 1000)
  ctx.status = 200
  ctx.body = payload
}

/** @type {Mware} */
export async function reqPayload(ctx, next) {
  if (!methods.has(ctx.method))
    return next()

  const payload = []

  for await (const chunk of ctx.req)
    payload.push(chunk)

  ctx.payload = Buffer.concat(payload).toString()
  return parsePayload(ctx, next)
}

/** @type {Mware} */
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

