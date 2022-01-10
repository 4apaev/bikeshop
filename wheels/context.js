// @ts-check
import Http from 'http'
import {
  Is,
  Log,
  HTTPFail,
} from '../util/index.js'

import * as Mim from './mim.js'

/**
 * @typedef {import("./app.js").default} App
 */

const statuses = Http.STATUS_CODES
const debug = Log.debug('app.ctx')

export default class Ctx {
  /** @type {string} */ method
  /** @type {string} */ pathname
  /** @type {string} */ path
  /** @type {URL}    */ url
  /** @type {*}      */ user
  /** @type {*}      */ payload
  /** @type {*}      */ #body
  /** @type {number} */ #code

  /**
   * @param {Http.IncomingMessage} req
   * @param {Http.ServerResponse} res
   * @param {App} app
   */
  constructor(req, res, app) {
    this.req = req
    this.res = res
    this.app = app
    this.url = new URL(req.url, 'file:')
    this.method = req.method
    this.path = this.url.pathname
    this.pathname = this.url.pathname
    this.payload = undefined
  }

  get body()     { return this.#body }

  get codeSent() { return this.#code === 0 }
  get headSent() { return this.res.headersSent }
  get writable() { return !this.res.writableEnded }

  get status()   { return this.res.statusCode }
  get type()     { return this.get('content-type') }

  // @ts-ignore
  get length()   { return this.get('content-length') | 0 }

  // @ts-ignore
  get size()     { return this.get('content-length', 1) | 0 }

  get auth()     {
    const [ , x = '' ] = this.get('authorization', 1).split(' ')
    return x
      ? Buffer.from(x, 'base64').toString() // atob
      : x
  }

  set auth(x)     {
    this.set('www-authenticate', Buffer.from(x).toString('base64'))
  }

  set status(x) { this.headSent || (this.res.statusCode = this.#code = x) }
  set type(x)   { this.set('content-type', Mim.get(x)) }
  set length(x) { this.set('content-length', String(x)) }
  set body(x) {
    this.#body = x
    this.#code || (this.status = 200)
  }

  /**
   * @param {string} k
   * @param {number} [rq]
   * @return {boolean}
   */
  is(k, rq) {
    return Mim.is(k, this.get('content-type', rq))
  }

  /**
   * @param {string} k
   * @param {number} [rq]
   * @return {boolean}
   */
  has(k, rq) {
    return rq
      ? k in this.req.headers
      : this.res.hasHeader(k)
  }

  /**
   * @param {string} k
   * @param {number} [rq]
   * @return {string}
   */
  get(k, rq) {
    return rq === 1
      ? String(this.req.headers[ k ] ?? '')
      : String(this.res.getHeader(k) ?? '')
  }

  /**
   * @param {string} k
   * @param {string} v
   */
  set(k, v) {
    this.headSent || this.res.setHeader(k, v)
  }

  /**
   * @param {string} k
   */
  remove(k) {
    this.headSent || this.has(k) || this.res.removeHeader(k)
  }

  raise(...a) {
    throw new HTTPFail(...a)
  }

  /**
   * @param {Error} e
   * @see {@link https://nodejs.org/api/errors.html#nodejs-error-codes}
   */
  onerror(e) {
    debug('ctx.onerror', e)

    if (this.headSent || !this.writable)
      return Log.err('[ ctx.onerror ] response not writable')

    // @ts-ignore
    let c = e?.code
    let m = e?.message

    if (Is.nodErr(e)) {
      c = c == 'ENOENT'
        ? 404
        : 500
    }

    if (Is.not.i(c)) {
      c = Number.isNaN(+c)
        ? 500
        : +c
    }
    this.status = c
    this.res.end(m ?? statuses[ c ] ?? String(e))
  }

}

