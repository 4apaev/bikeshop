// @ts-check
import Fs from 'fs'
import Emitter from 'events'
import {
  format as frmt,
} from 'util'
import {
  Transform,
} from 'stream'

import Is from '../util/is.js'
import { period } from '../util/date.js'

const DELAY = 3000
const cwd = process.cwd()

export const Evt = new Emitter

/**
 * @param {string} event
 * @param {string} data
 */
function watcher(event, data) {
  Evt.emit('data', { event, data })
}

// debounce(watcher)

Fs.watch(cwd + '/pub', cwd == '/bikeshop'
  ? {}
  : { recursive: true }, watcher)

/** @type {import('koa').Middleware} */
export default async function SSERoute(ctx) {
  ctx.request.socket.setTimeout(0)
  ctx.req.socket.setNoDelay(true)
  ctx.req.socket.setKeepAlive(true)

  ctx.set({
    'connection': 'keep-alive',
    'content-type': 'text/event-stream',
    'cache-control': 'no-cache',
  })

  const sse = new Transform({
    transform,
    writableObjectMode: true,
  })

  const write = sse.write.bind(sse)

  ctx.status = 200
  ctx.body = sse

  Evt.on('data', write)

  const id = setInterval(uptime, DELAY)
  const end = () => {
    console.log('------ CLOSE  ----------')
    clearInterval(id)
    Evt.off('data', write)
  }

  sse.on('close', end)
  sse.on('error', end)
}

function uptime() {
  Evt.emit('data', {
    event: 'ping',
    data: period(process.uptime() * 1000),
  })
}

/**
 * @param {*} chunk
 * @param {BufferEncoding} enc
 * @param {import('stream').TransformCallback} cb
 */
function transform(chunk, enc, cb) {
  this.push(format(chunk))
  cb()
}

/**
 * @param  {Msg|string} msg
 * @return {string}
 */
export function format(msg) {
  const re = Is.s(msg)
    ? frmt('data: %s\n', msg)
    : Object.keys(msg).reduce((re, k) => re + frmt('%s: %j\n', k, msg[ k ]), '')
  return re + '\n\n'
}

/**
 * @typedef {Object} Msg
 * @prop {string=} id
 * @prop {string=} event
 * @prop {number=} retry
 * @prop {string|object} data
 */
