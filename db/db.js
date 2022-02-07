/* eslint-disable no-unused-vars */
// @ts-check

import pg from 'pg'

import Log from '../util/log.js'

import { pgconf } from '../config/config.js'

const debug = Log.debug('db')
export const pool = new pg.Pool(pgconf)

pool.on('connect', () => debug('[pool] connected'))
pool.on('remove', () => debug('[pool] client removed'))
pool.on('error', e => debug(`[pool:error]`, e))

/**
 * @param {string | pg.QueryArrayConfig<any>} sql
 * @param {*[]} params
 * @param {1|true} [single]
 * @returns {Promise<QRes>}
 */
export default async function query(sql, params, single) {
  let error, result

  try {
    result = await pool.query(sql, params)
  }

  catch (e) {
    Log.error('[db:error]', error = e)
  }

  return {
    error,
    result,
    value: single
      ? result?.rows?.[ 0 ]
      : result?.rows,
  }
}

/**
 * @param {string} table
 * @param {...string} keys
 */
export function where(table, ...keys) {
  const head = `select ${ keys.join(', ') } from ${ table }`

  return /** @type {QWhere} */ (props, limit = 10) => {
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
    q.push(`limit ${ limit };`)
    return query(q.join(`\n  `), values)
  }
}

/**
 * @callback QWhere
 * @param {Object<string, *>} props
 * @param {number} [limit=10]
 */

/**
 * @typedef {Object} QRes
 * @prop {pg.DatabaseError?} error
 * @prop {pg.QueryResult} result
 * @prop {?} value
 */
