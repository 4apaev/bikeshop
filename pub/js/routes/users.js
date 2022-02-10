import Table from '/js/routes/table.js'

export default class Users extends Table {
  slug = 'user'
  title = 'Users'
  cells = [ 'id', 'uname', 'email' ]
  apiUrl = `/api/users`
  createRoute = `/app/users/create`
}

Users.define()
