// @ts-check
import Fs from 'fs'
import { Transform } from 'stream'
import { EventEmitter } from 'events'
import { period } from '../util/date.js'

const LF = '\r\n'
const cwd = process.cwd()
const DELAY = 3000
const Evt = new EventEmitter

/** @type {import('koa').Middleware} */
export default async function SSERoute(ctx) {
  ctx.request.socket.setTimeout(0)
  ctx.req.socket.setNoDelay(true)
  ctx.req.socket.setKeepAlive(true)

  ctx.set('Connection', 'keep-alive')
  ctx.set('Cache-Control', 'no-cache')
  ctx.set('Content-Type', 'text/event-stream')

  const sse = new Transform({
    transform,
    writableObjectMode: true,
  })

  const write = sse.write.bind(sse)
  const end = close(setInterval(uptime, DELAY), write)

  sse.on('close', end)
  sse.on('error', end)

  ctx.status = 200
  ctx.body = sse

  Evt.on('data', write)

}

////////////////////////////////////////////////////////////////////////////////////////////////
// FORMAT
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {string} k
 * @param {string|object} v
 * @return {string}
 */
function frmt(k, v) {
  if (Object(v) === v)
    v = JSON.stringify(v)
  return k + ':' + v + LF
}

/**
 * @param  {Msg|string} msg
 * @return {string}
 */
export function format(msg) {
  if (typeof msg == 'string')
    return frmt('data', msg)

  let re = ''
  if ('id' in msg)    re += frmt('id', msg.id)
  if ('event' in msg) re += frmt('event', msg.event)
  if ('retry' in msg) re += frmt('retry', msg.retry)
  if ('data' in msg)  re += frmt('data', msg.data)
  return re + LF
}

////////////////////////////////////////////////////////////////////////////////////////////////
// HELPERS
////////////////////////////////////////////////////////////////////////////////////////////////

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
 * @param {NodeJS.Timer} id
 * @param {(...args: any[]) => void} cb
 */
function close(id, cb) {
  return () => {
    console.log('------ CLOSE  ----------')
    clearInterval(id)
    Evt.off('data', cb)
  }
}

function uptime() {
  Evt.emit('data', {
    event: 'ping',
    data: period(process.uptime() * 1000),
  })
}

////////////////////////////////////////////////////////////////////////////////////////////////
// WATCHER
////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * @param {string} event
 * @param {string} data
 */
function watcher(event, data) {
  Evt.emit('data', { event, data })
}

Fs.watch(cwd + '/pub', cwd == '/backend' ? {} : { recursive: true }, watcher)

/**
 * @typedef {Object} Msg
 * @prop {string} [id]
 * @prop {string} [event]
 * @prop {number} [retry]
 * @prop {string|object} data
 */
