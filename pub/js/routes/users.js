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
