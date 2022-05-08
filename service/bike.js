// @ts-check
import * as Bike from '../db/bikes.js'
import Is from '../util/is.js'
import request, { assert } from './db.request.js'

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
  let id = +ctx?.params?.id
  assert(Is.n(id = +id), 400, 'invalid bike id')
  return Bike.get({ id })
})

/** @type {Mware} */
export const list = request('Bikes.List', ctx => {
  const q = Object.fromEntries(ctx.URL?.searchParams ?? [[ 'limit', 10 ]])
  return Bike.list(q)
})

/** @type {Mware} */
export const create = request('Bikes.Create', ctx => {
  let {
    desc = '',
    kind = 'city',
  } = ctx?.payload ?? {}

  assert(Is.s(desc), 400, 'invalid bike desc')
  assert(Kind.has(kind), 400, 'invalid bike kind')

  return Bike.create({ kind, desc })
})

/**
 * @typedef {import('koa').Middleware} Mware
 *//**
 * @typedef {import('koa').Context} Context
 */
