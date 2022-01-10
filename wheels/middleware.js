/* eslint-disable no-unused-vars */
// @ts-check

import Fs from 'fs'
import Path from 'path'
import * as Mim from './mim.js'
import * as Jwt from './jwt.js'
import { Log } from '../util/index.js'

/** @typedef {import("koa").Middleware} Middleware */

const debug = Log.debug('middleware')

export const methods = new Set([
  'POST',
  'PUT',
  'PATHCH',
  'DELETE',
])


/** @type {Middleware} */
export function useAuth(ctx, next) {
  const token = ctx.get('authorization')
  if (token) { // eslint-disable-next-line no-cond-assign
    if (ctx.user = Jwt.verify(token))
      return next()
    else
      debug('signature mismatch', token)
  }
  else {
    debug('no authorization header')
  }

  ctx.status = 401
  ctx.type = 'text'
  ctx.set('authorization', 'Basic realm="401"')
  ctx.body = 'authentication required'
}


/** @type {Middleware} */
export async function logger(ctx, next) {
  const start = Date.now()
  await next()
  console.log('%d %s %s %s', ctx.status, ctx.method, ctx.path, Date.now() - start)
}

/** @type {Middleware} */
export function favicon(ctx, next) {
  ctx.type = Mim.ico
  ctx.body = Buffer.from(`data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==`)
}

/** @type {Middleware} */
export async function reqPayload(ctx, next) {
  if (!methods.has(ctx.method))
    return next()

  const payload = []

  for await (const chunk of ctx.req)
    payload.push(chunk)

  ctx.payload = Buffer.concat(payload).toString()
  return parsePayload(ctx, next)
}

/** @type {Middleware} */
function parsePayload(ctx, next) {
  if (!ctx.is('json'))
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

/*
  export async function reqPayloadSimple(ctx, next) {
    if (!methods.has(ctx.method))
      return next()

    ctx.payload = ''
    ctx.req.setEncoding('utf8')
    ctx.req.on('data', x => ctx.payload += x)
    ctx.req.on('sfinish', () => parsePayload(ctx, next))
  }
 */



