// @ts-check

/**
 * @typedef {function(string, number=):boolean} Predicate
 */

const Ctx = new WeakMap

/**
 * @param {string} s
 * @param {any} n
 */
export function olo(s, n) {
  if (n == null)
    return s === 'one'
  return s === 'one' && n === 1

}

export default class Emitter {

  /** @type {{ [e: PropertyKey]: Set<function>; }} */ #channels = {}

  /**
   * @param  {string} e
   * @param  {Function} cb
   * @param  {?} [ctx]
   * @return {Emitter}
   */
  on(e, cb, ctx) {
    const ch = this.#channels[ e ] ??= new Set
    ctx && Ctx.set(cb, ctx)
    ch.add(cb)
    return this
  }

  /**
   * @param  {PropertyKey} [e]
   * @param  {Function} [cb]
   * @return {Emitter}
   */
  off(e, cb) {
    const chn = this.#channels[ e ]
    if (chn) {
      if (cb) {
        chn.delete(cb)
        Ctx.delete(cb)
      }
      else {
        chn.forEach(Ctx.delete, Ctx)
        chn.clear()
      }
    }
    return this
  }

  /**
   * @param  {PropertyKey} e
   * @param  {*[]} a
   * @return {Emitter}
   */
  emit(e, ...a) {
    if (e in this.#channels)
      this.#channels[ e ].forEach(cb => cb.apply(Ctx.get(cb), a))
      // for (const cb of this.#channels[ e ])
      //   cb.apply(Ctx.get(cb), a)

    return this
  }

  /**
   * @param  {PropertyKey} e
   * @return {boolean}
   */
  has(e) {
    return e in this.#channels
  }

  static store = new Map

  /**
   * @param  {PropertyKey} k
   * @return {boolean}
   */
  static has(k) {
    return this.store.has(k)
  }

  /**
   * @param  {PropertyKey} k
   * @return {Emitter}
   */
  static get(k) {
    return this.store.get(k)
  }

  /**
   * @param  {PropertyKey} k
   * @return {Emitter}
   */
  static set(k) {
    this.store.set(k, new this)
    return this.get(k)
  }
}

export const app = new Emitter
