/* eslint-disable no-unused-vars */
// @ts-check
import { Is, Log } from '../util/index.js'
import query, { where } from './db.js'

/** @typedef {import("./db.js").QRes} QRes */

/**
 * @prop   {object} params
 * @return {Promise<QRes>}
 */
export const list = where('users_bikes', 'uid', 'bid', 'checkin', 'checkout')

/**
 * @prop   {string} id
 * @return {Promise<QRes>}
 */
export function get({ uid, bid }) {
  return query(`
    select * from users_bikes
      where
        uid=$1
      and
        bid=$2
      limit
        1;
  `, [ +uid, +bid ])
}

/**
 * @prop   {number} uid
 * @prop   {number} bid
 * @prop   {?Date}  [checkin]
 * @prop   {?Date}  [checkout]
 * @return {Promise<QRes>}
 */
export function create({ uid, bid, checkin, checkout }) {
  return query(`
    insert into users_bikes(uid, bid, checkin, checkout)
      values($1, $2, $3, $4)
      returning *;
  `, [ +uid, +bid, checkin, checkout ])
}

