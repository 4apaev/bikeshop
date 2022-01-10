/* eslint-disable no-unused-vars */
import { Stream } from 'stream'
// isDeepStrictEqual,

export default function compose(args) {
  return ctx => {
    let prev = -1

    function emit(next) {

      if (next <= prev || next > args.length) {
        const e = new Error(`next called multiple times`)
        e.code = 500
        console.error('[COMPOSE:reject]', e.message)
        return Promise.reject(e)
      }

      const cb = args[ prev = next ]

      if (!cb)
        return Promise.resolve()

      try {

        return Promise.resolve(cb(ctx, emit.bind(null, next + 1)))
      }

      catch (e) {
        console.error('[COMPOSE:reject]')
        return Promise.reject(e)
      }
    }

    return emit(prev + 1)
  }
}


export function respond(ctx) {
  let b = ctx.body
  // if (b == null || ctx.status === 204 || ctx.status === 304) {
  //   ctx.length = 0
  //   console.log('################## %s ###############################', ctx.url)
  //   return ctx.res.end()
  // }

  const hasType = ctx.headSent || ctx.has('content-type')

  if (b instanceof Stream) {
    hasType || (ctx.type = 'bin')
    b.pipe(ctx.res)
  }

  else if (Buffer.isBuffer(b)) {
    ctx.length = Buffer.byteLength(b)
    ctx.res.end(b)
  }

  else {
    if (typeof b == 'object')
      hasType || (ctx.type = 'json')

    b && (ctx.length = Buffer.byteLength(b = JSON.stringify(b)))
    ctx.res.end(b)
  }
}
