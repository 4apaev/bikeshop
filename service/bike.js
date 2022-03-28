// @ts-check
import * as Bike from '../db/bikes.js'
import { Is, Log } from '../util/index.js'

const debug = Log.debug('service:bikes')
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
export async function get(ctx) {
  ctx.status = 200
  ctx.type = 'json'

  const id = +ctx?.params?.id

  if (Is.not.n(id))
    return ctx.deny(400, 'invalid id')

  const { error, value } = await Bike.get({ id })

  if (error) {
    debug('GET', error)
    ctx.throw(400, error)
  }
  else {
    ctx.body = value[ 0 ]
  }
}

/** @type {Mware} */
export async function list(ctx) {
  ctx.status = 200
  ctx.type = 'json'

  const query = Object.fromEntries(ctx.URL.searchParams || [])
  const { error, value } = await Bike.list(query)

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
    kind,
    desc,
  } = ctx?.payload ?? {}

  Kind.has(kind) || (kind = 'city')

  const { error, value } = await Bike.create({
    kind,
    desc,
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
