// @ts-check
import Fs from 'fs'
import {
  stat as Stats,
} from 'fs/promises'
import Path from 'path'
import Styl from 'stylus'
import Koa from 'koa'
import {
  Log,
  sanitizePath,
} from '../util/index.js'
import * as Mim from '../util/mim.js'
const debug = Log.debug('static')

/** @typedef {import("koa").Context} Context */
/** @typedef {import("koa").Middleware} Middleware */

/**
 * @param {string} [base]
 * @param {{ [x: string]: string; }} [dict]
 */
export function statiq(base, dict) {
  base ??= process.cwd()
  dict ??= { '/': '/index.html' }
  return /** @type {Koa.Middleware} */ ctx => {
    let path = sanitizePath(ctx.path)
    return sendFile(ctx, Path.join(base, dict[ path ] ?? path))
  }
}

/**
 * @param {string} file
 */
export function send(file) {
  return /** @type {Koa.Middleware} */ ctx =>
    sendFile(ctx, file)
}

/**
 * @param {Koa.Context} ctx
 * @param {string} file
 */
export async function sendFile(ctx, file) {
  try {
    const stat = await Stats(file)

    if (ETag(ctx, stat)) return

    ctx.status = 200
    if (file.endsWith('.styl')) {
      ctx.type = 'css'
      ctx.body = await compileAsync(file, ctx.URL.searchParams) // @ts-ignore
      ctx.length = Buffer.byteLength(ctx.body)
    }
    else {
      ctx.type = Mim.fromFile(file, 'txt')
      ctx.body = Fs.createReadStream(file)
      ctx.length = stat.size
    }
    ctx.lastModified = stat.mtime
  }
  catch (e) {
    debug('[not found]', e)
    ctx.status = 404
    ctx.body = `<h1>${ e }</h1>`
    ctx.type = 'html'
  }
}

/**
 * @param {Context} ctx
 * @param {Fs.Stats} stat
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
 * @param { string } filename
 * @param {{ (e?: Error, css?: string): void }} fn
 * @param { URLSearchParams } opts
 */
export default function compile(filename, fn, opts) {

  return Fs.readFile(filename, 'utf-8', (e, css) => e
    ? fn(e)
    : Styl(css, {
      filename,
      globals: Object.fromEntries(opts),
    }).render(fn))
}

/**
 * @param { string } filename
 * @param { URLSearchParams } opts
 * @returns { Promise<string> }
 */
export function compileAsync(filename, opts) {
  return new Promise((ok, nope) => compile(filename, (e, css) => {
    if (e)
      nope(e)
    else
      ok(css)
  }, opts))
}
