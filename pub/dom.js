import Def from './define.js'

const A = Array
const O = Object
const E = new WeakMap

export default function JQ(s, e = document, cb) {
  if (typeof e == 'function')
    cb = e, e = document
  return A.from(e.querySelectorAll(s), cb)
}

export function create(name, props, ...children) {
  const el = document.createElement(name)
  if (props) {
    if (toString.call(props) === '[object Object]')
      el.attr(props)
    else
      el.append(props)
  }
  el.append(...children)
  return el
}

JQ.create = create
JQ.find = (s, e = document) => e.querySelector(s)
JQ.frag = () => document.createDocumentFragment()

JQ.formData = frm => Def.from(new FormData(frm))

Def.alias(Node.prototype, 'textContent', 'text')
Def.alias(Node.prototype, 'parentElement', 'parent')
Def.alias(Element.prototype, 'classList', 'clss')
Def.alias(Element.prototype, 'querySelector', 'find')
Def.alias(Element.prototype, 'lastElementChild', 'last')
Def.alias(Element.prototype, 'firstElementChild', 'first')
Def.alias(Element.prototype, 'nextElementSibling', 'next')
Def.alias(Element.prototype, 'previousElementSibling', 'prev')

Def.use(Element.prototype, {

  $(s, cb) {
    return A.from(this.querySelectorAll(s), cb)
  },

  html(s, ...a) {
    if (s == null)
      return this.innerHTML

    let re = ''

    if (a.length === 0) {
      re = s
    }
    else {
      let i = 0
      for (let v; i < a.length; i++) {
        re += s.raw[ i ] + (A.isArray(v = a[ i ])
          ? v.join('')
          : v)
      }
      re += s.raw[ i ]
    }
    return this.empty().insert(re)
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

  set(k, v) {
    if (v == null || typeof v == 'boolean') { this.toggleAttribute(k, !!v) }
    else if (k === 'class' || k === 'className') {
      if (typeof v == 'object') {
        if (A.isArray(v)) { this.classList.add(...v) }
        else {
          for (const [ a, b ] of O.entries(v))
            this.classList.toggle(a, !!b)
        }
      }

      else { this.classList.add(v) }
    }

    else { this.setAttribute(k, v) }

    return this
  },

  attr(k, v) {
    if (!k)
      return Def.from(A.from(this.attributes, a => [ a.name, a.value ]))

    if (v === undefined)
      return this.getAttribute(k)

    if (typeof k == 'object') {
      for (const [ a, b ] of O.entries(k))
        this.set(a, b)
    }
    else { this.set(k, v) }
    return this
  },


  on(type, query, cb, ctx) {
    if (typeof query == 'function')
      ctx = cb, cb = query, query = null

    const listener = query
      ? e => e.target.matches(query) && cb.call(ctx, e)
      : e => cb.call(ctx, e)

    const off = (a, b) => {
      if ((!a || a === type) && (!b || b === cb))
        return this.removeEventListener(type, listener), true
      return false
    }

    E?.get?.(this)?.push?.(off) ?? E.set(this, [ off ])
    this.addEventListener(type, listener)
    return this
  },

  off(type, cb) {
    const it = E.get(this)
    if (it) {
      let j = 0
      if (typeof type == 'function')
        cb = type, type = null
      for (let i = 0; i < it.length; i++) {
        if (!it[ i ](type, cb))
          it[ j++ ] = it[ i ]
      }
      it.length = j
      j === 0 && E.delete(this)
    }
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


for (let t of `
script link style
br hr div nav ol ul li dl dt dd
table col colgroup caption tr td th thead tbody tfoot
main header aside footer hgroup h1 h2 h3 h4 h5 h6
article p i q b u s em span pre code del dfn ins kbd
section abbr acronym time address cite mark samp blockquote sub sup big small strong strike
figure figcaption audio video picture img svg canvas a button dialog  details summary
form data datalist fieldset legend label input textarea output meter progress select optgroup option
`.match(/\S+/g)) {
  Def(JQ, t, {
    value(p, ...ch) {
      return create(t, p, ...ch)
    },
  })
}


