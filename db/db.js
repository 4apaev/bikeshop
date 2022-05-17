// @ts-check

import pg from 'pg'
import Log from '../util/log.js'
import { pgconf } from '../config/config.js'

const debug = Log.debug('db')
export const pool = new pg.Pool(pgconf)

pool.on('connect', () => debug('[pool] connected'))
pool.on('remove', () => debug('[pool] client removed'))
pool.on('error', e => debug(`[pool:error]`, e))

/** @type {Query} */
export default async function query(sql, params = []) {
  let error, result
  try {
    result = await pool.query(sql, params)
    return {
      error,
      result,
      value: result?.rows ?? [],
    }
  }

  catch (e) {
    Log.error('[db:error]', e.message)
    return {
      error: e,
      result,
      value: [],
    }
  }
}

/**
 * @param  {TemplateStringsArray} s
 * @param  {*[]} a
 */
export function tmpl(s, ...a) {
  return query(String.raw(s, ...a), [])
}

/**
 * @param  {string} table
 * @param  {string[]} keys
 * @return {Where}
 */
export function where(table, ...keys) {
  const head = `select "${ keys.join('", "') }" from ${ table }`

  return (props, limit) => {
    let i = 0
    let params = []
    let values = []
    let q = [ head ]

    for (let k of keys) {
      if (k in props) {
        params.push(`    ${ k } = $${ ++i }`)
        values.push(props[ k ])
      }
    }

    params.length && q.push('where', params.join(`\n  and\n`))
    q.push(`limit ${ limit ?? props.limit ?? 10 };`)
    return query(q.join(`\n  `), values)
  }
}

/**
 * @typedef {Object} QRes
 * @prop {import('pg').DatabaseError|Error} [error]
 * @prop {import('pg').QueryResult} result
 * @prop {?} value
 */

/** @typedef {string|import('pg').QueryArrayConfig} QString */
/** @typedef {(props: Object<string, *>, limit?: number) => Promise<QRes>} Where */
/** @typedef {(sql: QString, params?: *[]) => Promise<QRes>} Query */

