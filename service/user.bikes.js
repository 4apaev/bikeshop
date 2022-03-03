// @ts-check

import * as UserBike from '../db/user.bikes.js'
import { Is, Log } from '../util/index.js'

const debug = Log.debug('service:user-bikes')

/** @type {Mware} */
export async function get(ctx) {
  ctx.status = 200
  ctx.type = 'json'

  let { uid, bid } = ctx?.params ?? {}

  try {
    Is.assert.n(uid = +uid, 'invalid user id')
    Is.assert.n(bid = +bid, 'invalid bike id')
  }
  catch (e) {
    return ctx.throw(400, e)
  }

  const { error, value } = await UserBike.get({ uid, bid })

  if (error) {
    ctx.throw(400, error)
    debug('GET', error)
  }
  else {
    ctx.body = value[ 0 ]
  }
}

/** @type {Mware} */
export async function list(ctx) {
  ctx.status = 200
  ctx.type = 'json'
  const q = Object.fromEntries(ctx.URL?.searchParams ?? [])
  const { error, value } = await UserBike.list(q)

  if (error) {
    debug('LIST', error)
    ctx.throw(400, error)
  }
  else {
    ctx.body = value
  }
}

/** @type {Mware} */
export async function create(ctx) {
  ctx.status = 200
  ctx.type = 'json'

  let {
    uid,
    bid,
    checkin,
    checkout,
  } = ctx?.payload ?? {}

  try {
    Is.assert.n(uid = +uid, 'invalid user id')
    Is.assert.n(bid = +bid, 'invalid bike id')
    Is.assert.n(Date.parse(checkin), 'invalid checkin date')
    Is.assert.n(Date.parse(checkin), 'invalid checkin date')
  }
  catch (e) {
    return ctx.throw(400, e)
  }

  const { error, value } = await UserBike.create({
    uid,
    bid,
    checkin,
    checkout,
  })

  if (error) {
    debug('CREATE', error)
    ctx.throw(400, error)
  }
  else {
    ctx.body = { value }
  }

}

/**
 * @typedef {import('koa').Middleware} Mware
 */
