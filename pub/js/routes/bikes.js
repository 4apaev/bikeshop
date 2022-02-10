import Table from '/js/routes/table.js'

export default class Bikes extends Table {
  slug = 'bike'
  title = 'Bikes'
  apiUrl = `/api/bikes`
  createRoute = `/app/bikes/create`
  cells = [ 'id', 'kind', 'details' ]
}

Bikes.define()
