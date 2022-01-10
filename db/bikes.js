// @ts-check
import query from './db.js'

/** @typedef {import("./db.js").QRes} QRes */


/**
 * @async
 * @prop {string} kind
 * @prop {string} details
 * @return {Promise<QRes>}
 */

export function create({ kind, details }) {
  return query(`insert into bikes(kind, details) values($1, $2) returning *;`, [ kind, details ?? '' ], 1)
}

/**
 * @async
 * @prop {string} id
 * @return {Promise<QRes>}
 */
export function get({ id }) {
  return query(`select * from bikes where id=$1 limit 1;`, [ id ], 1)
}

