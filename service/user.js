// @ts-check
import * as User from '../db/users.js'
import { Log } from '../util/index.js'
import { create as createToken } from '../wheels/jwt.js'
import respond from './respond.js'

/** @typedef {import("koa").Middleware} Middleware */

const debug = Log.debug('[service:users]')

export /** @type {Middleware} */ const get = respond(User.get, {
  debug,
  msg: 'user not found',
  before(ctx) {
    return { id: ctx?.params?.id }
  },

})

export /** @type {Middleware} */ const list = respond(User.list, {
  debug,
  msg: 'user not found',
  before(ctx) { // @ts-ignore
    const o = ctx.URL.searchParams
    return o
      ? Object.fromEntries(o)
      : { limit: 10 }
  },
})

export /** @type {Middleware} */ const create = respond(User.create, {
  debug,
  msg: 'fail to create user',
  before(ctx) { // @ts-ignore
    return {
      uname: ctx.payload?.uname,
      email: ctx.payload?.email,
      pass: ctx.payload?.pass,
    }
  },
  validate(o) {
    return validate(o, [ 'uname', 'email', 'pass' ])
  },
})

export /** @type {Middleware} */ const auth = respond(User.auth, {
  debug,
  msg: 'fail to auth user',
  after: createToken,
  validate(o) {
    return validate(o, [ 'email', 'pass' ])
  },
})

/**
 * @param {{ [x: string]: string; }} o
 * @param {string[]} args
 */
function validate(o, args) {
  for (const k of args) {
    if (typeof o[ k ] != 'string')
      return `invalid prop: "${ k }"`
  }
}
