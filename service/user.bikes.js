// @ts-check

import * as UserBike from '../db/user.bikes.js'
import Is from '../util/is.js'
import request, { assert } from './db.request.js'

/** @type {Mware} */
export const get = request('User.Bikes.Get', ctx => {
  let { uid, bid } = ctx?.params ?? {}
  assert(Is.n(uid = +uid), 400, 'invalid user id')
  assert(Is.n(bid = +bid), 400, 'invalid bike id')
  return UserBike.get({ uid, bid })
})

/** @type {Mware} */
export const list = request('Users.Bikes.List', ctx => {
  const q = Object.fromEntries(ctx.URL?.searchParams ?? [[ 'limit', 10 ]])
  return UserBike.list(q)
})

/** @type {Mware} */
export const create = request('Users.Bikes.Create', ctx => {
  let {
    uid,
    bid,
    checkin,
    checkout,
  } = ctx?.payload ?? {}

  assert(Is.n(uid = +uid), 400, 'invalid user id')
  assert(Is.n(bid = +bid), 400, 'invalid bike id')

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
