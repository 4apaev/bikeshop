// @ts-check
import Styl from 'stylus'
import { join, extname } from 'path'
import { stat as getStats } from 'fs/promises'
import * as Fs from 'fs'

// import Is from '../util/is.js'
import Log from '../util/log.js'
import { statiq as staticConf } from '../config/config.js'

/**
 * @typedef {import('koa').Next} Next             *//**
 * @typedef {import('koa').Context} Context       *//**
 * @typedef {import('koa').Middleware} Middleware *//**
 * @typedef {import('fs').Stats} Stats            *//**
 * @typedef {import('querystring').ParsedUrlQuery} QSParams *//**
 * @typedef {{[k: string]: string}} SDict         */

const debug = Log.debug('static')

/**
 * @param  {string} [base]
 * @param  {SDict} [dict]
 * @return {Middleware}
 */
export function statiq(base, dict) {
  return ctx => {
    base ??= staticConf.dir
    dict ??= staticConf.dict
    let path = sanitizePath(ctx.path)
    return sendFile(ctx, join(base, dict[ path ] ?? path))
  }
}

/**
 * @param  {string} file
 * @return {Middleware}
 */
export function send(file) {
  return ctx =>
    sendFile(ctx, file)
}

/**
 * @param {Context} ctx
 * @param {string} file
 */
export async function sendFile(ctx, file) {
  try {
    const stat = await getStats(file)

    if (ETag(ctx, stat)) return

    ctx.status = 200
    if (file.endsWith('.styl')) {
      const re = await readAndRender(file, ctx.query)
      ctx.body = re
      ctx.type = 'css'
      ctx.length = Buffer.byteLength(re)
    }
    else {
      ctx.type = file.split('.').pop()
      ctx.body = Fs.createReadStream(file)
      ctx.length = stat.size
    }
    ctx.lastModified = stat.mtime
  }
  catch (e) {
    debug('not found', e.message)
    ctx.status = 404
    ctx.body = `<h1>${ e }</h1>`
    ctx.type = 'html'
  }
}

/**
 * @param  {Context} ctx
 * @param  {Stats} stat
 * @return {boolean}
 */
function ETag(ctx, stat) {
  const tag = `"W/${ stat.mtime.getTime().toString(16) }-${ stat.size.toString(16) }"`
  if (ctx.req.headers[ 'if-none-match' ] === tag) {
    ctx.status = 304
    return true
  }
  ctx.set('ETag',  tag)
  ctx.set('Last-Modified',  stat.mtime.toUTCString())
  return false
}

/**
 * @param {string} filename
 * @param {QSParams} globals
 * @return {Promise<string>}
 */
export function readAndRender(filename, globals) {
  return new Promise((resolve, reject) => {
    Fs.readFile(filename, 'utf-8', (e, data) => e
      ? reject(e)
      : Styl(data, { filename, globals }).render((e, css) => e
        ? reject(e)
        : resolve(css)))
  })
}

/**
 * @param {string} x
 * @return {string}
 */
function sanitizePath(x) {
  const prev = []
  for (let next of x.split('/')) {
    if (next.startsWith('..'))
      prev.pop()
    else if (next != '.')
      prev.push(next)
  }
  return prev.join('/')
}
