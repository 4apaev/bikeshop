// @ts-check
import Koa from 'koa'

const Kind = new Set([
  'city',
  'road',
  'mountain',
  'cruiser',
  'electric',
  'folding',
  'fixie',
])

import * as Bike from '../db/bikes.js'
import { Log } from '../util/index.js'
import respond from './respond.js'

const debug = Log.debug('[service:bikes]')

export /** @type {Koa.Middleware} */ const get = respond(Bike.get, {
  debug,
  msg: 'bike not found',
  before(ctx) {
    return { id: +ctx.path.split('/').pop() }
  },
})

export /** @type {Koa.Middleware} */ const list = respond(Bike.list, {
  debug,
  msg: 'bike not found',
  before(ctx) {
    const o = ctx.URL.searchParams
    return o
      ? Object.fromEntries(o)
      : { limit: 10 }
  },
})

export /** @type {Koa.Middleware} */ const create = respond(Bike.create, {
  debug,
  msg: 'fail to create bike',

  /** @param {{ kind: string; }} o */
  validate(o) {
    if (!Kind.has(o?.kind))
      return `invalid prop: bike: "kind"`
  },
})
