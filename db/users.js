// @ts-check
import query from './db.js'

/** @typedef {import("./db.js").QRes} QRes */

/**
 * @async
 * @prop {string} name
 * @prop {string} mail
 * @prop {string} pass
 * @return {Promise<QRes>}
 */
export function create({ name, mail, pass }) {
  return query(`
  insert into users(uname, email, pass)
    values($1, $2, crypt($3, gen_salt('bf')))
    returning
      id, uname, mail;
  `, [ name, mail, pass ], 1)
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
 * @prop {number} limit
 * @return {Promise<QRes>}
 */
export function list({ limit = 10 }) {
  return query(`
    select id, uname, email from users
      limit
        $1;
  `, [ limit ])
}

/**
 * @async
 * @prop {string} mail
 * @prop {string} pass
 * @return {Promise<QRes>}
 */
export function auth({ mail, pass }) {
  return query(`
    select id, uname, email from users
      where
        email = $1
      and
        pass = crypt($2, pass)
      limit
        1;
  `, [ mail, pass ], 1)
}


