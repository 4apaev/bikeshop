// @ts-check
import * as UB from '../db/user.bikes.js'
import { Log } from '../util/index.js'
import respond from './respond.js'

/** @typedef {import("koa").Middleware} Middleware */

const debug = Log.debug('[service:user.bikes]')

export /** @type {Middleware} */ const get = respond(UB.get, {
  debug,
  validate,
  before(ctx) {
    const { uid, bid } = ctx.params
    debug({ uid, bid })
    return { uid, bid }
  },
})

export /** @type {Middleware} */ const list = respond(UB.list, {
  debug,
  before(ctx) {
    const o = ctx.URL.searchParams
    return o
      ? Object.fromEntries(o)
      : { limit: 10 }
  },
})

export /** @type {Middleware} */ const create = respond(UB.create, {
  debug,
  msg: 'fail to create user bike',
  validate,
  before(ctx) {
    const { uid, bid, checkin, checkout } = ctx.payload
    return { uid, bid, checkin, checkout }
  },

})

/**
 * @param {{uid: string; bid: string}} o
 */
function validate(o) {
  if (o.uid == null)
    return 'invalid user id'
  if (o.bid == null)
    return 'invalid bike id'
}
