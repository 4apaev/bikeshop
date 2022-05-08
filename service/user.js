// @ts-check
import Is from '../util/is.js'
import * as User from '../db/users.js'
import { create as createToken } from '../wheels/jwt.js'
import request, { assert } from './db.request.js'

/** @type {Mware} */
export const get = request('Users.Get', ctx => {
  let id = +ctx?.params?.id
  assert(Is.n(id = +id), 400, 'invalid user id')
  return User.get({ id })
})

/** @type {Mware} */
export const list = request('Users.List', ctx => {
  const q = Object.fromEntries(ctx.URL?.searchParams ?? [[ 'limit', 10 ]])
  return User.list(q)
})

/** @type {Mware} */
export const create = request('Users.Create', ctx => {
  let {
    name,
    mail,
    pass,
  } = ctx?.payload ?? {}

  assert(Is.s(name), 400, 'invalid user name')
  assert(Is.s(mail), 400, 'invalid user mail')
  assert(Is.s(pass), 400, 'invalid user pass')

  return User.create({ name, mail, pass })
})

/** @type {Mware} */
export const auth = request('Users.auth', async ctx => {
  let {
    mail,
    pass,
  } = ctx?.payload ?? {}

  assert(Is.s(mail), 400, 'invalid user name')
  assert(Is.s(pass), 400, 'invalid user pass')

  const { error, value } = await User.auth({ mail, pass })
  if (error)
    return { error, value }

  const id = value?.[ 0 ]?.id
  assert(id, 401, 'invalid user credentials')

  const token = createToken({
    id,
    mail,
    date: new Date,
  })

  ctx.cookies.set('tok', token, {
    maxAge: 1000 * 60 * 60 * 24,
    overwrite: true,
  })

  return { code: 200, value: { token }}

})

/**
 * @typedef {import('koa').Middleware} Mware
 *//**
 * @typedef {import('koa').Context} Context
 */
