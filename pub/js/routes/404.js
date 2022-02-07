export default class Notfound extends HTMLElement {
  uid = crypto.randomUUID().replace(/^[\d-]+/, '')
  connectedCallback() {
    this.html`
      <section class="${ this.uid }">
        <h2>404 Not Found</h2>
      </section>
    `
  }
}

customElements.define('ws-notfound', Notfound)
