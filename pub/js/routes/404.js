export default class Notfound extends HTMLElement {
  connectedCallback() {
    this.html`<h2 class="not-found">404 Not Found</h2>`
  }
}

customElements.define('ws-notfound', Notfound)
