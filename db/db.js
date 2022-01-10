/* eslint-disable no-unused-vars */
// @ts-check

import pg from 'pg'

import { Log } from '../util/index.js'

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
 * @typedef {Object} QRes
 * @prop {pg.DatabaseError?} error
 * @prop {pg.QueryResult} result
 * @prop {?} value
 */



/*
 * @param {string | pg.QueryArrayConfig<any>} sql
 * @param {string[]} params
 * @param {string} [fallback]
 * @returns {Promise<pg.QueryResult>}

  export default async function Query(sql, params, fallback) {
    try {
      return await pool.query(sql, params)
    }
    catch (e) {
      Log.e('[db:error]', e)
      return fallback ?? e
    }
  }
 */







/*
  Query.client = async ( sql, params, fallback) => {
    const client = await pool.connect()

    try {
      return client.query(sql, params)
    }

    catch (e) {
      Log.err('[db:error]', e)
      fallback ??= e
    }

    finally {
      client.release()
    }

    return fallback
  }
*/


