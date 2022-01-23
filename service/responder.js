/* eslint-disable no-unused-vars */

import { O, Log } from '../util/index.js'

/** @typedef {import("koa").Context} Context */
/** @typedef {import("koa").Middleware} Middleware */
/** @typedef {import("../db/db.js").QRes} QRes */

/**
 * @typedef {Object} Opts
 * @prop {string} msg
 * @prop {number} [code]
 * @prop {(ctx: Context) => *} [before]
 * @prop {function} [validate]
 * @prop {function} [after]
 * @prop {function} [debug]
 */




export default class Respond {
  debug = Log.debug('[service:respond]')
  params = [ 'id' ]

  status = {
    ok: { code: 200, message: 'ok' },
    query: { code: 500, message: 'query internal error' },
    empty: { code: 404, message: 'query yeild no result' },
    invalid: { code: 400, message: 'invalid payload' },
  }


  async method(x) {
    return x
  }

  after(x) {
    return x
  }

  before(payload) {
    let re = O.o
    for (let k of this.params)
      re[ k ] = payload[ k ]
    return re
  }

  validate(payload) {
    for (let k of this.params)
      if (payload[ k ] == null) return `invalid prop "${ k }"`
  }


  /** @type {Middleware} */
  async handle(ctx) {
    ctx.type = 'json'

    let status
    let payload = this.before(ctx.payload || O.from(ctx.URL.searchParaams))



    if (this.validate(payload)) {
      const { error, value } = await this.method(payload)

      if (error) {
        status = this.status.query
        if (error.message)
          status.message = error
        this.debug(error)
      }

      else if (value != null) {
        status = this.status.ok
        status.value = this.after(value)
      }
      else {
        status = this.status.empty
      }

    }
    else {
      status = this.status.invalid
    }

    ctx.status = status.code
    ctx.body = {
      error: status.error,
      message: status.error,
      value: status.value,
    }
  }
}


