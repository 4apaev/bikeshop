// @ts-check
import query, { where } from './db.js'

/** @typedef {import("./db.js").QRes} QRes */

/**
 * @prop   { string } name
 * @prop   { string } mail
 * @prop   { string } pass
 * @return { Promise<QRes> }
 */
export function create({ name, mail, pass }) {
  return query(`
  insert into users(name, mail, pass)
    values($1, $2, crypt($3, gen_salt('bf')))
    returning
      id, name, mail;
  `, [ name, mail, pass ])
}

/**
 * @prop   {string} id
 * @return {Promise<QRes>}
 */
export function get({ id }) {
  return query(`
    select id, name, mail from users
      where
        id=$1
      limit
        1;
  `, [ id ])
}

/**
 * @prop   {object} params
 * @return {Promise<QRes>}
 */
export const list = where('users', 'id', 'name', 'mail')

/**
 * @prop   {string} mail
 * @prop   {string} pass
 * @return {Promise<QRes>}
 */
export function auth({ mail, pass }) {
  return query(`
    select id, name, mail from users
      where
        mail = $1
      and
        pass = crypt($2, pass)
      limit
        1;
  `, [ mail, pass ])
}

