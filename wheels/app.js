import Http from 'http'
import Event from 'events'
import Ctx from './context.js'
import compose, { respond } from './compose.js'
import {
  Is,
  Log,
} from '../util/index.js'

const debug = Log.debug('app')

export default class App extends Event {
  /**
   * @type {useRoute[]}
   * @private
   */
  middleware = []

  /** @type {useMethod} */ get(url, cb) { this.use('GET', url, cb) }
  /** @type {useMethod} */ del(url, cb) { this.use('DELETE', url, cb) }
  /** @type {useMethod} */ put(url, cb) { this.use('PUT', url, cb) }
  /** @type {useMethod} */ post(url, cb) { this.use('POST', url, cb) }
  /** @type {useMethod} */ patch(url, cb) { this.use('PATCH', url, cb) }

  listen() {
    const server = Http.createServer(this.init())
    return server.listen.apply(server, arguments)
  }

  /**
   * @returns {Http.RequestListener}
   */
  init() {
    const next = compose(this.middleware)

    return async (/** @type {Http.IncomingMessage} */ rq, /** @type {Http.ServerResponse} */ rs) => {

      const ctx = this.ctx = new Ctx(rq, rs, this)
      const onErr = this.onErr(ctx, 0)

      this.listenerCount('error') || this.on('error', onErr)

      try {
        await next(this.ctx)
        respond(this.ctx)
      }
      catch (e) {
        debug('ON ERR', e)
        onErr(e)
      }
    }
  }

  /**
   * @param {Ctx} ctx
   * @param {number} handled
   */
  onErr(ctx, handled) {
    return (/** @type {Error} */ e) => {
      Log.err('[error:handled: %d] %s', handled, e)
      if (handled === 0) {
        handled = 1
        ctx.onerror(e)
      }
    }
  }


  /**
   * @param {...*} args
   */
  use(...args) {
    let cb
    let handler = []

    for (const a of args) {
      if (Is.f(a)) {
        cb = a
      }
      else if (a instanceof RegExp) {
        handler.push(ctx => a.test(ctx.req.url))
      }
      else if (Is.s(a)) {
        if (isHttpMethod(a))
          handler.push(ctx => ctx.method === a.toUpperCase())
        else
          handler.push(ctx => ctx.req.url === a)
      }
    }
    Is.assert.f(cb, 'missing route callback')
    this.middleware.push((ctx, next) => {
      if (handler.length === 0 || handler.every(fn => fn(ctx)))
        return cb(ctx, next)
      else
        return next()

    })
  }
}

/**
 * @param {string} x
 * @return {boolean}
 */
function isHttpMethod(x) {
  return Http.METHODS.includes(x.toUpperCase())
}


/**
 * @callback useRoute
 * @param {Ctx} ctx
 * @param {function} [next]
 */

/**
 * @callback useMethod
 * @param {string|RegExp} url
 * @param {useRoute} cb
 */

/**
 * @callback checkRoute
 * @param {string} x
 * @return {boolean}
 */
