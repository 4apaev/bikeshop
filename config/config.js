/* eslint-disable key-spacing */
import Fs from 'fs'
import Path from 'path'
import { mergeEnv } from '../util/env.argv.js'

export const cwd = process.cwd()

export const {
  NODE_ENV          = 'dev',
  POSTGRES_DB       = 'database',
  POSTGRES_USER     = 'postgres',
  POSTGRES_HOST     = '0.0.0.0',
  POSTGRES_PASSWORD = '',
  POSTGRES_PORT     = 5432,
  BIKESHOP_PORT     = 3000,
  BIKESHOP_SECRET   = '',
  BIKESHOP_DEBUG    = '*',
  // [
  //   'users',
  //   'bikes',
  //   'service',
  //   'service:users',
  //   'service:bikes',
  //   'service:user-bikes',
  //   'middleware',
  // ],
} = getConfig()

export const env    = NODE_ENV
export const port   = BIKESHOP_PORT
export const debug  = BIKESHOP_DEBUG
export const secret = BIKESHOP_SECRET
export const pgconf = {
  database: POSTGRES_DB,
  user    : POSTGRES_USER,
  host    : POSTGRES_HOST,
  port    : +POSTGRES_PORT,
  password: POSTGRES_PASSWORD,
}

export function join(...a) {
  return Path.join(cwd, ...a)
}

export function read(...a) {
  return Fs.readFileSync(join(...a), 'utf8')
}

export function readdir(...a) {
  return Fs.readdirSync(join(...a), 'utf8')
}

function getConfig() {
  try {
    const str = read('.env')
    const opt = mergeEnv(str)
    console.log(opt)
    return opt
  }
  catch (e) {
    console.error('no .env file found')
    throw e
  }
}

