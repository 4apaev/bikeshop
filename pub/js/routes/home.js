export default class Home extends HTMLElement {

  uid = crypto.randomUUID().replace(/^[\d-]+/, '')

  connectedCallback() {
    this.html`
      <section class="${ this.uid }">
        <h2>Home</h2>
        <pre></pre>
      </section>
    `

  }
}

customElements.define('ws-home', Home)
