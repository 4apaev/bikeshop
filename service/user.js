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
    return { id: ctx.URL.searchParams.get('id') }
  },

  validate(o) {
    return validate(o, [ 'id' ])
  },
})

export /** @type {Middleware} */ const query = respond(User.list, {
  debug,
  msg: 'user not found',
  before(ctx) { // @ts-ignore
    let limit = parseInt(ctx.URL.searchParams.get('limit')) || 10
    return { limit }
  },

  validate() {
    return true
  },
})

export /** @type {Middleware} */ const create = respond(User.create, {
  debug,
  msg: 'fail to create user',
  before(ctx) { // @ts-ignore
    return {
      name: ctx?.payload?.name ?? ctx?.payload?.uname,
      mail: ctx?.payload?.mail ?? ctx?.payload?.email,
      pass: ctx?.payload?.pass ?? ctx?.payload?.password,
    }
  },
  validate(o) {
    return validate(o, [ 'name', 'mail', 'pass' ])
  },
})

export /** @type {Middleware} */ const auth = respond(User.auth, {
  debug,
  msg: 'fail to auth user',
  after: createToken,
  validate(o) {
    return validate(o, [ 'mail', 'pass' ])
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
