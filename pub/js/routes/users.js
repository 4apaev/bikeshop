import Table from '/js/routes/table.js'

export default class Users extends Table {

  slug = 'user'
  title = 'Users'
  cells = [ 'id', 'uname', 'email' ]
  apiUrl = `/api/user`
  createRoute = `/app/users/create`

  // get slug() { return 'user' }
  // get title() { return 'Users' }
  // get cells() { return [ 'id', 'uname', 'email' ] }
  // get apiUrl() { return `/api/user` }
  // get createRoute() { return `/app/users/create` }

  constructor() {
    super()
  }
}

Users.define()

/*
  export default class Users extends HTMLElement {

    uid = crypto.randomUUID().replace(/^[\d-]+/, '')
    tmpl = `
      <style>
        @import url('/css/users.styl?uid=${ this.uid }')
      </style>

      <section class="${ this.uid }">
        <h2>Users</h2>
        <a route="/app/user/create?open=true">create</a>

        <table>
          <thead>
            <tr>
              <th>id</th>
              <th>name</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody></tbody>
        </table>

        <dialog>
          <a route>✕</a>
          <div name="output"></div>
        </dialog>
      </section>

      <ws-route
        comp="ws-auth"
        path="/app/user/create"
        src="/js/routes/user.create.js"
        open
        append
      ></ws-route>
    `.trim()

    get dialog() {
      return this.$('dialog')
    }

    get output() {
      return this.$('[name="output"]')
    }

    connectedCallback() {
      this.html(this.tmpl)
      this.on('click', 'a[route]', this.toggleDialog)
      Sync.get('/api/user', { limit: 10 })
        .then(this.render)
        .catch(Log.error)
    }

    disconnectedCallback() {
      this.off('click', this.toggleDialog)
    }

    toggleDialog = (e, stop) => {
      if (this.dialog.toggle('open'))
        e.preventDefault()
      else
        return history.back(), stop
    }

    render = ({ body }) => {
      const { frag } = $
      for (const x of body.value) {
        frag.append($.tr(
          $.td(x.id),
          $.td(x.uname),
          $.td(x.email),
        ))
      }
      this.$('tbody').empty().append(frag)
    }
  }

  customElements.define('ws-users', Users)

*/
