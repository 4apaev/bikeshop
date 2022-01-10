// @ts-check

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


/** @typedef {import("koa").Middleware} Middleware */

const debug = Log.debug('[service:bikes]')

export /** @type {Middleware} */ const get = respond(Bike.get, {
  debug,
  msg: 'bike not found',
  before(ctx) {
    const id = new URL(ctx.url, 'file:').searchParams.get('id')
    return { id }
  },

  /** @param {{ id: string; }} o */
  validate(o) {
    if (typeof o.id != 'string')
      return `invalid prop: bike: "id"`
  },
})

export /** @type {Middleware} */ const create = respond(Bike.create, {
  debug,
  msg: 'fail to create bike',

  /** @param {{ kind: string; }} o */
  validate(o) {
    if (!Kind.has(o?.kind))
      return `invalid prop: bike: "kind"`
  },
})
