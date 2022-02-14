// @ts-check
import Crypt from 'crypto'

import {
  Log,
} from '../util/index.js'

const debug = Log.debug('jwt')

const LNK = '.'
const {
  BIKESHOP_SECRET: secret,
} = process.env

/**
 * @param  { string } s
 * @param  { BufferEncoding } [e]
 * @return { string }
 */
export function enc(s, e) {
  return Buffer.from(s).toString(e ?? 'base64')
}

/**
 * @param  { WithImplicitCoercion<string>  } s
 * @param  { BufferEncoding } [e]
 * @return { string }
 */
export /* atob */ function dec(s, e) {
  return Buffer.from(s, e ?? 'base64').toString()
}

/**
 * @param  { * } o
 * @param  { BufferEncoding } [e]
 * @return { string }
 */
export /* btoa */ function encode(o, e) {
  return enc(JSON.stringify(o), e)
}

/**
 * @param { WithImplicitCoercion<string>  } s
 * @param { BufferEncoding } [e]
 */
export /* atob */ function decode(s, e) {
  try {
    return JSON.parse(dec(s, e))
  }
  catch (_) {
    debug('[decode:Invalid JSON]', _)
  }
}

/**
 * @param  { Object<string, *> } o
 * @return { string }
 */
export function create(o) {
  const head = encode({ typ: 'jwt', alg: 'HS256' })
  const body = encode(o)
  const sig = sign(head, body)
  return [ head, body, sig ].join(LNK)
}

/**
 * @param { string } s
 */
export function verify(s) {
  if (typeof s != 'string' || s.length < 1)
    return

  const [ head, body, sig ] = s.split(LNK)
  if (sig === sign(head, body))
    return decode(body)
}

/**
 * @param {...string} a
 * @return {string}
 */
export function sign(...a) {
  return Crypt.createHmac('SHA256', secret)
      .update(a.join(LNK))
      .digest('base64')
}

/** @type {import("koa").Middleware} */
export function useAuth(ctx, next) {
  const token = ctx.get('authorization')
  if (token) {
    const x = verify(token)
    if (x) {
      ctx.user = x
      return next()
    }
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
