// @ts-check
import query, { where } from './db.js'

/** @typedef {import("./db.js").QRes} QRes */

/**
 * @prop   {number} uid
 * @prop   {string} token
 * @return {Promise<QRes>}
 */
export function create({ uid, token }) {
  return query(`
  insert into access_tokens(uid, token)
    values($1, $2)
    returning *;
  `, [ uid, token ])
}

/**
 * @prop   {string} id
 * @return {Promise<QRes>}
 */
export function get({ id }) {
  return query(`
    select * from access_tokens
      where
        id = $1
      limit
        1;
  `, [ id ])
}

/**
 * @prop   {Object<string, *>} params
 * @return {Promise<QRes>}
 */
export const list = where('id', 'uid', 'token', 'created', 'expires')
