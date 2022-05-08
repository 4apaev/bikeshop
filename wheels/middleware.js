// @ts-check
import crypto from 'crypto'
import * as Mim from '../util/mim.js'
import Log from '../util/log.js'

import * as format from '../util/date.js'

const debug = Log.debug('middleware')

/** @typedef {import("koa").Middleware} Mware */

export const methods = new Set([
  'POST',
  'PUT',
  'PATHCH',
  'DELETE',
])

/** @type {Mware} */
export async function logger(ctx, next) {
  const start = Date.now()
  ctx.params = {}
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
  ctx.status = 200
  debug('HEALTCHECK', ctx.body = format.uptime().join())
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

