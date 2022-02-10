import Sync from '/js/sync.js'
import Auth from '/js/routes/user.create.js'

export default class Remind extends Auth {
  tmpl = `
    <style>
      @import url('/css/auth.styl?margin=2em&uid=${ this.uid }')
    </style>

    <form class="${ this.uid }">
      <legend>Remind</legend>

      <blockquote></blockquote>

      <fieldset>
        <label for=email>email</label>
        <input
          required
          id=email
          name=email
          type=email
          minLength="6"
          placeholder="alice@shoshi.dog"
        />
      </fieldset>
      <button class="btn send">remind</button>
      <nav>
        <a route="/app/login">login</a>
      </nav>
    </form>
  `

  send() {
    return Sync.post('/api/user/remind', {
      email: this.mail.value,
    })
  }

}

customElements.define('ws-remind', Remind)
