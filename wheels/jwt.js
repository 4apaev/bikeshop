/* eslint-disable no-unused-vars */

import {
  createHmac,
  randomBytes,
  randomInt,
  randomUUID,
} from 'crypto'

const { BIKESHOP_SECRET: secret } = process.cwd()
const LNK = randomUUID()

export const rand = randomInt
export const uuid = randomUUID
export const bytes = randomBytes

export function enc(s, e) /* btoa */ {
  return Buffer.from(s).toString(e ?? 'base64')
}

export function dec(s, e) /* atob */ {
  return Buffer.from(s, e ?? 'base64').toString()
}

export function encode(o, e) {
  return enc(JSON.stringify(o), e)
}

export function decode(s, e) {
  try {
    return JSON.parse(dec(s, e))
  }
  catch (_) {
    return false
  }
}

export function create(o) {
  const head = encode({ typ: 'jwt', alg: 'HS256' })
  const body = encode(o)
  const sig = sign(head, body)
  return [ head, body, sig ].join(LNK)
}

export function verify(s) {
  if (typeof s != 'string' || s.length < 1)
    return false
  const [ head, body, sig ] = s.split(LNK)
  return sig === sign(head, body)
    ? decode(body)
    : false
}

export function sign(...a) {
  return createHmac('SHA256', secret)
    .update(a.join(LNK))
    .digest('base64')
}
