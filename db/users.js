// @ts-check
import query, { where } from './db.js'

/** @typedef {import("./db.js").QRes} QRes */

/**
 * @async
 * @prop { string } uname
 * @prop { string } email
 * @prop { string } pass
 * @return { Promise<QRes> }
 */
export function create({ uname, email, pass }) {
  return query(`
  insert into users(uname, email, pass)
    values($1, $2, crypt($3, gen_salt('bf')))
    returning
      id, uname, email;
  `, [ uname, email, pass ], 1)
}

/**
 * @async
 * @prop {string} id
 * @return {Promise<QRes>}
 */
export function get({ id }) {
  return query(`
    select id, uname, email from users
      where
        id=$1
      limit
        1;
  `, [ id ], 1)
}

/**
 * @async
 * @prop {object} params
 * @return {Promise<QRes>}
 */
export const list = where('users', 'id', 'uname', 'email')

/**
 * @async
 * @prop {string} email
 * @prop {string} pass
 * @return {Promise<QRes>}
 */
export function auth({ email, pass }) {
  return query(`
    select id, uname, email from users
      where
        email = $1
      and
        pass = crypt($2, pass)
      limit
        1;
  `, [ email, pass ], 1)
}

