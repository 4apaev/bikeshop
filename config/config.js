/* eslint-disable key-spacing */
import Fs from 'fs'
import Path from 'path'

export const cwd = process.cwd()
export const isContainer = cwd === '/backend'

export const statiq = {
  cwd,
  dir: cwd + '/pub',
  index: cwd + '/pub/index.html',
  dict: {
    '/': '/index.html',
  },
}

export const {
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_PASSWORD,
  BIKESHOP_SECRET = '',
  BIKESHOP_DEBUG = '*',
  BIKESHOP_PORT = 3000,
  NODE_ENV = 'development',
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
    opt.POSTGRES_HOST = isContainer
      ? 'db'
      : 'localhost',
    console.log(opt)
    return opt
  }
  catch (e) {
    console.error('no .env file found')
    throw e
  }
}

function mergeEnv(str, u) {
  let re = {}
  let prev = u

  for (let next of str.split(/\n+/g)) {
    if ((next = next.trim()).length === 0)
      continue

    let [ k, v ] = next.split('=').map(s => s.trim())

    if (v) {
      prev = u
      if (k in process.env)
        console.log('override', k, v)

      re[ k ] = process.env[ k ] = v
    }
    else if (prev) {
      re[ prev ].push(k)
      process.env[ prev ] = re[ prev ]
    }
    else {
      prev = k
      if (k in process.env)
        console.log('override', prev)
      process.env[ prev ] = re[ prev ] = []
    }
  }
  return re
}
