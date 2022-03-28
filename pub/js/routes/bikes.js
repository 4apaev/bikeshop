import Table from '/js/routes/table.js'

export default class Bikes extends Table {
  slug = 'bike'
  title = 'Bikes'
  apiUrl = `/api/bikes`
  createRoute = `/app/bikes/create`
  // cells = [ 'id', 'kind', 'desc' ]
  cells = [
    { key: 'id', type: 'number', label: 'id'  },
    { key: 'desc', type: 'text', label: 'desc' },
    { key: 'kind', type: 'enum', label: 'kind' },
  ]

  fields = [
    {
      key: 'desc',
      type: 'text',
      label: 'desc',
      placeholder: 'bike desc',
    },
    {
      key: 'kind',
      label: 'kind',
      required: true,
      options: [
        'city',
        'road',
        'mountain',
        'cruiser',
        'electric',
        'folding',
        'fixie',
      ],
    },
  ]

}

Bikes.define()
