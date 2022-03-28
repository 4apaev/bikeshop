// @ts-check
import query, { where } from './db.js'

/** @typedef {import("./db.js").QRes} QRes */

/**
 * @prop   {string} kind
 * @prop   {string} desc
 * @return {Promise<QRes>}
 */
export function create({ kind, desc }) {
  return query(`
  insert into bikes("kind", "desc")
    values($1, $2)
    returning *;
  `, [ kind, desc ?? '' ])
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
 * @prop   {?string} [desc]
 * @prop   {?number} [limit = 10]
 * @return {Promise<QRes>}
 */
export const list = where('bikes', 'id', 'kind', 'desc')
