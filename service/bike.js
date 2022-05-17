// @ts-check
import * as Bike from '../db/bikes.js'
import Is from '../util/is.js'
import request from './db.request.js'

const Kind = new Set([
  'city',
  'road',
  'mountain',
  'cruiser',
  'electric',
  'folding',
  'fixie',
])

/** @type {Mware} */
export const get = request('Bikes.Get', ctx => {
  let id = ctx?.params?.id
  Is.n(id = +id) || ctx.throw(400, 'invalid bike id')
  return Bike.get({ id })
})

/** @type {Mware} */
export const list = request('Bikes.List', ctx =>
  Bike.list({ limit: 10, ...ctx.query }))

/** @type {Mware} */
export const create = request('Bikes.Create', ctx => {
  let {
    desc = '',
    kind = 'city', // @ts-ignore
  } = ctx?.request?.body ?? {}

  Is.s(desc) || ctx.throw(400, 'invalid bike desc')
  Kind.has(kind) || ctx.throw(400, 'invalid bike kind')

  return Bike.create({ kind, desc })
})

/**
 * @typedef {import('koa').Middleware} Mware
 *//**
 * @typedef {import('koa').Context} Context
 */
