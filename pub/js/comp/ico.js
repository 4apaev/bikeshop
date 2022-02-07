/* eslint-disable no-unused-vars */
export class Ico extends HTMLElement {

  connectedCallback() {
    const w = this.get('w') ?? 64
    const h = this.get('h') ?? w
    const id = this.get('id')

    this.html`
      <svg width="${ w }" height="${ h }">
        <use href="/img/icons.svg#${ id }"></use>
      </svg>
    `
  }
}

export class Emg extends HTMLElement {
  connectedCallback() {
    const size = this.get('size') ?? 1
    this.set('style', `font-size:${ size }em`)
  }
}

// function scale(n, em = 12) {
//   let y = n * 10
//   let w = n * 10
//   let h = n * 10
//   return {

//   }
// }

customElements.define('ws-ico', Ico)
customElements.define('ws-emg', Emg)
