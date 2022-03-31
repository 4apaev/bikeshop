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
 * @param  {string | pg.QueryArrayConfig<*>} sql
 * @param  {*[]} [params]
 * @return {Promise<QRes>}
 */
export async function _query(sql, params) {
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
    Log.error('[db:error]', e)
    return {
      error: e,
      result,
      value: [],
    }
  }
}

export default async function query(sql, params) {

  return new Promise((done, fail) => {
    pool.query(sql, params, (error, result) => {
      if (error) {
        Log.error('[db:error]', error)
        fail({
          error,
          result,
          value: [],
        })
      }
      else {
        done({
          error,
          result,
          value: result?.rows ?? [],
        })
      }
    })
  })

}

/**
 * @param  {TemplateStringsArray} s
 * @param  {*[]} a
 */
export function tmpl(s, ...a) {
  return query(String.raw(s, ...a))
}

/**
 * @param  {string} table
 * @param  {string[]} keys
 * @return {QWhere}
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
 * @callback QWhere
 * @param {Object<string, *>} props
 * @param {number} [limit=10]            *//**

 * @typedef {Object} QRes
 * @prop {pg.DatabaseError | Error } [error]
 * @prop {pg.QueryResult} result
 * @prop {?} value                        *//**

 * @typedef { string | TemplateStringsArray | pg.QueryArrayConfig<*> } SqlStr
 */
