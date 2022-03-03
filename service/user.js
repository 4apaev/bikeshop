// @ts-check
import * as User from '../db/users.js'
import { Is, Log } from '../util/index.js'
import { create as createToken } from '../wheels/jwt.js'

const debug = Log.debug('service:users')

/** @type {Mware} */
export async function get(ctx) {
  ctx.status = 200
  ctx.type = 'json'

  const id = +ctx?.params?.id

  if (Is.not.n(id))
    return ctx.deny(400, 'invalid id')

  const { error, value } = await User.get({ id })

  if (error) {
    debug('GET', error)
    return ctx.deny(400, error)
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
  const { error, value } = await User.list(query)

  if (error) {
    debug('LIST', error)
    return ctx.deny(400, error)
  }
  else {
    ctx.body = value
  }
}

/** @type {Mware} */
export async function create(ctx) {
  ctx.status = 200
  ctx.type = 'application/json'

  const {
    uname,
    email,
    pass,
  } = ctx?.payload ?? {}

  if (Is.not.s(uname))
    return ctx.deny(400, 'invalid name')

  if (Is.not.s(email))
    return ctx.deny(400, 'invalid email')

  if (Is.not.s(pass))
    return ctx.deny(400, 'invalid pass')

  // ctx.assert(, 400, 'invalid name')
  // ctx.assert(, 400, 'invalid email')
  // ctx.assert(, 400, 'invalid pass')

  const { error, value } = await User.create({
    uname,
    email,
    pass,
  })

  if (error) {
    debug('CREATE', error)
    ctx.deny(400, error)
  }
  else {
    ctx.body = { value }
  }

}

/** @type {Mware} */
export async function auth(ctx) {
  ctx.status = 200
  ctx.type = 'json'

  const { email, pass } = ctx?.payload ?? {}

  if (Is.not.s(email))
    return ctx.deny(400, 'invalid email')

  if (Is.not.s(pass))
    return ctx.deny(400, 'invalid pass')

  const { error, value } = await User.auth({ email, pass })

  if (error) {
    debug('CREATE', error)
    return ctx.deny(401, error)
  }

  const id = value?.[ 0 ]?.id
  if (!id) {
    debug('CREATE', error)
    return ctx.deny(401, 'invalid credentials')
  }

  const token = createToken({
    id,
    email,
    date: new Date,
  })

  ctx.cookies.set('tok', token, {
    maxAge: 1000 * 60 * 60 * 24,
    overwrite: true,
  })

  ctx.body = { token }
}

/**
 * @typedef {import('koa').Middleware} Mware
 */
