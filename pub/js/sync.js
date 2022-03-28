// @ts-check

// @ts-ignore
import is from '/util/is.js'
// @ts-ignore
import * as Mim from '/util/mim.js'

/**
 * @typedef {Object} Payload
 * @prop {number} code
 * @prop {boolean} ok
 * @prop {Headers} headers
 * @prop {?Error} [error]
 * @prop {?string} [body]
 */

export default class Sync {
  /** @type {Headers} */ static HEADERS = new Headers
  /** @type {string}  */ static BASE_URL = location.origin
  /** @type {string}  */ method = 'GET'
  /** @type {*}       */ body
  /** @type {Headers} */ headers = new Headers(Sync.HEADERS)

  get head() {
    return this.headers
  }

  get header() {
    return this.headers
  }

  /**
   * @param {string} [method='GET']
   * @param {string | URL} [url]
   */
  constructor(method, url) {
    if (method)
      this.method = method.toUpperCase()
    this.url = Sync.resolve(url)
  }

  /**
   * @method
   * @param {string} key
   * @return {boolean}
   */
  has(key) {
    return this.head.has(key)
  }

  /**
   * @method
   * @param {string} key
   */
  get(key) {
    return this.head.get(key)
  }

  /**
   * @method
   * @param {string} key
   * @param {string} val
   * @returns {Sync}
   */
  set(key, val) {
    if (is.o(key)) {
      for (let [ k, v ] of Object.entries(key))
        this.head.set(k, v)
    }
    else {
      this.head.set(key, val)
    }
    return this
  }

  /**
   * @method
   * @param {string} [alias]
   * @returns {Sync|string}
   */
  type(alias) {
    return alias
      ? this.set('content-type', Mim.get(alias))
      : this.get('content-type')
  }

  /**
   * @method
   * @prop {string | URL} url
   * @prop {string} method
   * @prop {Headers | Object<string, string>} headers
   * @prop {*} [body]
   * @return {Promise<Response>}
   */
  end({ url, body, method, headers }) {
    return fetch(url, { body, method, headers })
  }

  /**
   * @method
   * @param {*} body
   * @returns {Sync}
   */
  send(body) {
    if (body == null)
      return this

    if (is(HTMLFormElement, body))
      body = Object.fromEntries(new FormData(body))

    else if (is(FormData, body))
      body = Object.fromEntries(body)

    if (is.o(body)) {
      this.type() ?? this.type(Mim.json)
      this.body = JSON.stringify(body)
    }
    else {
      this.body = `${ body }`
    }
    return this.set('content-length', String(this.body.length))
  }

  /**
   * @method
   * @param {string | Object.<string, string>} key
   * @param {string} [val]
   * @returns {Sync}
   */
  query(key, val) {
    if (!key)
      return this

    if (is.o(key)) {
      for (const [ k, v ] of Object.entries(key))
        this.url.searchParams.set(k, v)
    }
    else {
      this.url.searchParams.set(String(key), val)
    }
    return this
  }

  /**
   * @method
   * @param { ...* } a
   * @return { Promise<Payload> }
   */
  then(...a) {
    return this.end({
      url: this.url,
      body: this.body,
      method: this.method,
      headers: this.headers,
    }).then(this.parse).then(...a)
  }

  /**
   * @param { Response } re
   * @return { Promise<Payload> }
   */
  async parse(re) {
    const payload = {
      ok: re.ok,
      code: re.status,
      headers: re.headers,
      error: null,
      body: null,
    }
    try {
      // TODO: handle streams
      payload.body = Mim.is('json', re.headers)
        ? await re.json()
        : await re.text()
    }
    catch (e) {
      payload.error = e
    }
    return re.ok
      ? payload
      : Promise.reject(payload)
  }

  /**
   * @param {URL|string} x
   * @return {URL}
   */
  static resolve(x) {
    x = String(x)
    return new URL(x, /^https?:/i.test(x)
      ? null
      : this.BASE_URL)
  }

  /**
   * @param {URL|string} url
   * @param {?} body
   * @return {Sync}
   */
  static get(url, body) {
    return new Sync('get', url).query(body)
  }

  /**
   * @param {URL|string} url
   * @param {?} body
   * @return {Sync}
   */
  static put(url, body) {
    return new Sync('put', url).send(body)
  }

  /**
   * @param {URL|string} url
   * @param {?} body
   * @return {Sync}
   */
  static post(url, body) {
    return new Sync('post', url).send(body)
  }

  /**
   * @param {URL|string} url
   * @param {?} body
   * @return {Sync}
   */
  static del(url, body) {
    return new Sync('delete', url).send(body)
  }
}
