/* eslint-disable no-unused-vars */
import $ from '../dom.js'

export default class Base extends HTMLElement {
  uid   = crypto.randomUUID().replace(/^[\d-]+/, '')
  slug  = 'base'
  title = 'base'
  css   = 'display: block'
  get tmpl() {
    return `<h3>base</h3>`
  }

  disconnectedCallback() {
    this.off()
  }

  connectedCallback() {
    const tmpl = this?.tmpl?.trim?.()
    const styl = this?.css?.trim?.()

    tmpl?.length && this.html(tmpl)
    styl?.length && this.insertBefore(
      $.style(this.css),
      this.$(':not(style)')
          || this.first,
    )
    this.classList.add(this.uid)
  }

  static define(tag) {
    tag ??= 'ws-' + this.name
    return customElements.define(tag.toLowerCase(), this)
  }
}

Base.define()

// this.attachShadow({ mode: 'open' })
// this.shadowRoot.innerHTML = this.tmpl
