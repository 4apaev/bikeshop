/* eslint-disable no-unused-vars */

// import Emitter from 'events'
// import {
//   ServerResponse,
//   IncomingMessage,
// } from 'http'

import {
  Readable,
  Writable,
} from 'stream'

import {
  ok,
  fail,
  match,
  throws,
  rejects,
  doesNotThrow,
  doesNotReject,
  doesNotMatch,
  deepStrictEqual as equal,
} from 'assert'

import App from '../wheels/app.js'
import {
  Log,
  echo,
  define as def,
} from '../util/index.js'

import {
  Req,
  Res,
} from './tools.js'


describe('App', () => {



  it('app.use', async () => {
    const app = new App

    const stack = []
    stack.add = x => async (ctx, next) => {
      stack.push('>> ' + x)
      await next()
      stack.push('<< ' + x)
    }

    app.use(stack.add('a'))

    app.post(async (ctx, next) => {
      stack.push('>> POST')
      await next()
      stack.push('<< POST')
    })

    app.use(async (ctx, next) => {
      stack.push('>> b')
      await next()
      stack.push('<< b')
    })

    app.get('/api', ctx => {
      stack.push('GET:/api')
      ctx.code = 200
    })

    app.use(async (ctx, next) => {
      stack.push('>> c')
      await next()
      stack.push('<< c')
    })


    const rq = new Req('GET', '/api')
    const rs = new Res(rq)
    const request = app.init()


    let er
    try {
      await request(rq, rs)
      Log('[Res:OK]')
    }
    catch (e) {
      er = e
    }

    finally {

      er && Log('[Res:err]', er)
      ok(er == null, 'must not reject')

      Log('[Stack]', stack)

      equal(stack, [
        '>> a',
        '>> b',
        'GET:/api',
        '<< b',
        '<< a',
      ])
      equal(200, rs.statusCode, 'statusCode should be 200')
    }

  })
})
