// @ts-check
import query, { where } from './db.js'

/** @typedef {import("./db.js").QRes} QRes */

/**
 * @prop   {string} kind
 * @prop   {string} details
 * @return {Promise<QRes>}
 */
export function create({ kind, details }) {
  return query(`
  insert into bikes(kind, details)
    values($1, $2)
    returning *;
  `, [ kind, details ?? '' ])
}

/**
 * @prop   {string} id
 * @return {Promise<QRes>}
 */
export function get({ id }) {
  return query(`
  select * from bikes
    where
      id=$1
    limit
      1;
  `, [ id ])
}

/**
 * @prop   {?string} [kind]
 * @prop   {?string} [details]
 * @prop   {?number} [limit = 10]
 * @return {Promise<QRes>}
 */
export const list = where('bikes', 'id', 'kind', 'details')
