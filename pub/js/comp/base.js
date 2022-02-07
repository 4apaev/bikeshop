/* eslint-disable no-unused-vars */

export default class Base extends HTMLElement {
  css
  slug  = 'base'
  title = 'base'
  tmpl  = `<h3>base</h3>`

  constructor() {
    super()
    this.uid = crypto.randomUUID().replace(/^[\d-]+/, '')
    // this.attachShadow({ mode: 'open' })
    // this.shadowRoot.innerHTML = this.tmpl
  }

  disconnectedCallback() {
    this.off()
  }

  connectedCallback() {
    this.html(this.tmpl.trim())
    this.constructor.style(this, this.css)
    this.classList.add(this.uid)
  }

  static style(el, css) {
    css && el.insert(`<style> ${ css } </style>`, 'afterbegin')
  }

  static define(tag) {
    tag ??= 'ws-' + this.name
    return customElements.define(tag.toLowerCase(), this)
  }
}

Base.define()
