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
  Is,
  Log,
  echo,
  define as def,
} from '../util/index.js'


const O = Object

/*  tos     */
/*  use     */

/*  nodErr  */
/*  raw     */
/*  eq      */
/*  it      */
/*  a       */
/*  b       */
/*  B       */
/*  E       */
/*  f       */
/*  i       */
/*  n       */
/*  o       */
/*  O       */
/*  P       */
/*  R       */
/*  s       */
/*  S       */
/*  u       */



// extends Readable
export class Req  {
  statusCode = 0
  aborted = false
  complete = false
  socket = O.o
  headers = O.o
  rawHeaders = []

  trailers = O.o
  rawTrailers = []

  constructor(m, u) {
    // super()
    this.method = m
    this.url = u
  }

  destroy(e) {}

  setTimeout(ms, cb) {
    setTimeout(cb, ms)
    return this
  }

}


// extends Writable
export class Res  {

  socket = { writable: true }
  statusCode

  sendDate = false
  finished = false
  headersSent = false
  writableEnded = false


  #headers = O.o

  constructor(req) {
    // super()
    this.req = req
  }

  setTimeout(ms, cb) {
    setTimeout(cb, ms)
    return this
  }

  setHeader(k, v) {
    Is.assert.s(k, '[Req:test:] `key` must be a string')
    this.#headers[ k.toLowerCase() ] = v
    return this
  }

  getHeader(k) {
    Is.assert.s(k, '[Req:test:] `key` must be a string')
    return this.#headers[ k.toLowerCase() ]
  }

  hasHeader(k) {
    Is.assert.s(k, '[Req:test:] `key` must be a string')
    return k.toLowerCase() in this.#headers
  }

  removeHeader(k) {
    Is.assert.s(k, '[Req:test:] `key` must be a string')
    return delete this.#headers[ k.toLowerCase() ]
  }


  getHeaders() {
    return O.assign(O.o, this.#headers)
  }

  getHeaderNames() {
    return O.keys(this.#headers)
  }

  end(x) {
    this.finished = true
    this.headersSent = true
    this.writableEnded = true
    this.socket.writable = false
    return x
  }

  addTrailers() {}
  flushHeaders() {}
}
