// @ts-check
import Fs from 'fs'
import Path from 'path'
import { Log } from '../util/index.js'
import * as Mim from './mim.js'

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

  return /** @type {Middleware} */ ctx =>
    sendFile(ctx, Path.join(base, dict[ ctx.path ] ?? ctx.path))
}

/**
 * @param {string} file
 */
export function send(file) {
  return /** @type {Middleware} */ ctx =>
    sendFile(ctx, file)
}

/**
 * @param {Context} ctx
 * @param {string} file
 */
export async function sendFile(ctx, file) {
  try {
    const stat = await Fs.promises.stat(file)
    ctx.status = 200
    ctx.length = stat.size
    ctx.type = Mim.fromFile(file, 'txt')
    ctx.body = Fs.createReadStream(file)
  }
  catch (e) {
    debug('[not found]', e)
    ctx.status = 404
    ctx.body = `<h1>${ e }</h1>`
    ctx.type = 'html'
  }
}
