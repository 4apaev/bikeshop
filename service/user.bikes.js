// @ts-check

import Is from '../util/is.js'
import Log from '../util/log.js'
import * as UserBike from '../db/user.bikes.js'
import request from './db.request.js'

const debug = Log.debug('scheduler 📅')

/** @type {Mware} */
export const get = request('User.Bikes.Get', ctx => {
  let { uid, bid } = ctx?.params ?? {}
  Is.n(uid = +uid) || ctx.throw(400, 'invalid user id')
  Is.n(bid = +bid) || ctx.throw(400, 'invalid bike id')
  return UserBike.get({ uid, bid })
})

/** @type {Mware} */
export const list = request('Users.Bikes.List', ctx =>
  UserBike.list({ limit: 10, ...ctx.query }))

/** @type {Mware} */
export const create = request('Users.Bikes.Create', ctx => {
  debug('Create')
  let {
    uid,
    bid,
    checkin,
    checkout, // @ts-ignore
  } = ctx?.request?.body ?? {}

  Is.n(uid = +uid) || ctx.throw(400, 'invalid user id')
  Is.n(bid = +bid) || ctx.throw(400, 'invalid bike id')

  return UserBike.create({
    uid,
    bid,
    checkin,
    checkout,
  })
})

/**
 * @typedef {import('koa').Middleware} Mware
 *//**
 * @typedef {import('koa').Context} Context
 */
