/* eslint-disable no-unused-vars */
import $ from '/js/dom.js'
import Sync from '/js/Sync.js'

export default class Scheduler extends HTMLElement {
  uid = crypto.randomUUID().replace(/^[\d-]+/, '')
  connectedCallback() {
    this.html`
      <section class="${ this.uid }">
        <h2>Scheduler</h2>
      </section>
    `
  }
}

customElements.define('ws-scheduler', Scheduler)
