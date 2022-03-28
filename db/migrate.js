import { read, readdir } from '../config/config.js'
import { Log } from '../util/index.js'
import { pool } from './db.js'

const debug = Log.debug('migrate')
const BASE_DIR = 'db/sql'

const dir = readdir(BASE_DIR)
    .filter(a => a.endsWith('.sql'))
    .sort((a, b) => +a.match(/^\d+/) - b.match(/^\d+/))
    .values()

/**
 * start queue
 */
setTimeout(next, 100)

let prev
function next(e, rs) {
  if (e) {
    Log.error(`Error at: %s
      %s
      code: %s
      table: %s
      detail: %s
      constraint: %s
    `, prev, e.message, e.code, e.table, e.detail, e.constraint, e.hint)
    process.exit(1)
  }

  else {
    prev && debug(`end`, prev)
    rs && Log.table(rs)
  }

  const { done, value } = dir.next()

  if (done) {
    debug('finish')
    process.exit(0)
  }

  debug(`start`, prev = value)
  pool.query(read(BASE_DIR, value), next)
}
