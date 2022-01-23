import O from '../define.js'

const µ = null
const A = Array
const E = new WeakMap

export function is(a, b) {
  return arguments.length === 2
    ? toString.call(b).slice(8, -1) == a?.name ?? a
    : a != µ
}

is.a = x => A.isArray(x)
is.s = x => typeof x == 'string'
is.f = x => typeof x == 'function'
is.o = x => typeof x == 'object' && x

export default function JQ(s, cb) {
  return cb
    ? A.from(document.querySelectorAll(s), cb)
    : document.querySelector(s)
}

O.use(JQ, {
  is,

  get frag() {
    return document.createDocumentFragment()
  },

  getEvents(x) {
    return E.get(x)
  },

  create(name, props, ...children) {
    const el = document.createElement(name)
    if (props) {
      if (is(O, props))
        el.attr(props)
      else
        el.append(props)
    }
    el.append(...children)
    return el
  },

  ico(src, attr) {
    return JQ.create('embed', O.assign({ src }, attr))
  },
})

O.alias(Node.prototype, 'textContent', 'text')
O.alias(Node.prototype, 'parentElement', 'parent')

O.alias(Element.prototype, 'classList', 'clss')
O.alias(Element.prototype, 'querySelector', 'find')
O.alias(Element.prototype, 'lastElementChild', 'last')
O.alias(Element.prototype, 'firstElementChild', 'first')
O.alias(Element.prototype, 'nextElementSibling', 'next')
O.alias(Element.prototype, 'previousElementSibling', 'prev')

O.use(Element.prototype, {

  $(s, cb) {
    return cb
      ? A.from(this.querySelectorAll(s), cb)
      : this.querySelector(s)
  },

  htm(s, ...a) {
    if (s == µ) return this.innerHTML
    if (a.length) {
      // eslint-disable-next-line no-var
      for (var i = 0, re = [ s.raw[ 0 ] ]; i < a.length;)
        re = re.concat(a[ i++ ], s.raw[ i ])
      s = re.join('')
    }
    return this.empty().insert(s)
  },

  empty() {
    while (this.first)
      this.removeChild(this.first.off().empty())
    return this
  },

  insert(x, pos = 'beforeEnd') {
    this[ x instanceof Element
      ? 'insertAdjacentElement'
      : 'insertAdjacentHTML' ](pos, x)
    return this
  },

  attr(k, v) {
    const i = arguments.length
    if (i === 0)
      return O.fromEntries(A.from(this.attributes, a => [ a.name, a.value ]))

    if (i === 1) {
      if (is.o(k)) {
        for (const [ a, b ] of O.entries(k))
          this.attr(a, b)
      }
      else {
        return this.getAttribute(k)
      }
    }

    else if (i === 2) {
      v ??= false
      let t = (typeof v)[ 0 ]
      if (t == 'b') {
        this.toggleAttribute(k, v)
      }

      else if (t == 'n') {
        this.setAttribute(k, v)
      }

      else if (t == 's') {
        k.startsWith('clas')
          ? this.classList.add(v)
          : this.setAttribute(k, v)
      }

      else if (t == 'o') {
        if (k.startsWith('class')) {
          this.classList.add(...[].concat(v))
        }
        else {
          for (const [ a, b ] of O.entries(v))
            this[ k ][ a ] = b
        }
      }
    }
    return this
  },

  on(ch, query, cb, ctx) {
    if (is.f(query))
      ctx = cb, cb = query, query = null

    const listener = query
      ? e => e.target.matches(query) && cb.call(ctx, e)
      : e => cb.call(ctx, e)


    const off = (a, b) => {
      if ((!a || a === ch) && (!b || b === cb)) {
        this.removeEventListener(ch, listener)
        return true
      }
      return false
    }

    E.get(this)?.push?.(off) ?? E.set(this, [ off ])
    this.addEventListener(ch, listener)
    return this
  },

  off(e, cb) {
    const it = E.get(this)
    if (it == µ) return this
    let j = 0

    if (is.f(e))
      cb = e, e = null

    for (let i = 0; i < it.length; i++) {
      if (!it[ i ](e, cb))
        it[ j++ ] = it[ i ]
    }
    it.length = j
    j === 0 && E.delete(this)
    return this
  },

  emit(e, detail = {}) {
    const ce = new CustomEvent(e, {
      detail,
      bubbles: true,
      cancelable: true,
    })
    this.dispatchEvent(ce)
    return this
  },

})


for (let t of ` script link style
                br hr div nav ol ul li dl dt dd
                table col colgroup caption tr td th thead tbody tfoot
                main header aside footer hgroup h1 h2 h3 h4 h5 h6
                article p i q b u s em span pre code del dfn ins kbd
                section abbr acronym time address cite mark samp blockquote sub sup big small strong strike
                figure figcaption audio video picture img svg canvas a button dialog  details summary
                form data datalist fieldset legend label input textarea output meter progress select optgroup option`.match(/\S+/g))
  JQ[ t ] = JQ.create.bind(µ, t)


