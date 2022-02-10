/* eslint-disable no-unused-vars */
import Sync from '/js/sync.js'

import Auth from '/js/routes/user.create.js'

export default class Login extends Auth {
  tmpl = `
    <style>
      @import url('/css/auth.styl?margin=2em&uid=${ this.uid }')
    </style>

    <form class="${ this.uid }">
      <legend>Login</legend>

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

      <fieldset>
        <label for=pass>password</label>
        <input
          required
          id=pass
          name=pass
          type=password
          placeholder="!123"
        />
      </fieldset>

      <button class="btn send">login</button>
      <nav>
        <a route="/app/remind">Remind</a>
      </nav>
    </form>
  `

  send() {
    return Sync.post('/api/user/auth', {
      email: this.mail.value,
      pass: this.pass.value,
    })
  }

}

customElements.define('ws-login', Login)
