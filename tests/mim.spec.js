import { deepStrictEqual as equal } from 'assert'
import * as Mim from '../util/mim.js'

describe('Mim', () => {
  it('exports: types', () => {
    equal(Mim.txt, 'text/plain')
    equal(Mim.css, 'text/css')
    equal(Mim.html, 'text/html')
    equal(Mim.ico, 'image/x-icon')
    equal(Mim.svg, 'image/svg+xml')
    equal(Mim.woff, 'font/woff')
    equal(Mim.gif, 'image/gif')
    equal(Mim.png, 'image/png')
    equal(Mim.jpg, 'image/jpeg')
    equal(Mim.xml, 'application/xml')
    equal(Mim.json, 'application/json')
    equal(Mim.js, 'application/javascript')
    equal(Mim.bin, 'application/octet-stream')
    equal(Mim.zip, 'application/zip')
    equal(Mim.form, 'multipart/form-data')
    equal(Mim.query, 'application/x-www-form-urlencoded')
  })

  describe('fromFile', () => {
    it('string', () => {
      const fl = '/a/b/img.png'
      equal(Mim.png, Mim.fromFile(fl))
    })

    it('url',    () => {
      const url = new URL('file://path/to/file.zip')
      equal(Mim.zip, Mim.fromFile(url))
    })
  })

  describe('fromHead', () => {
    let head
    const empty = ''
    const type = Mim.zip
    const fallback = Mim.xml

    it('empty', () => {
      equal(empty,     Mim.fromHead(head))
      equal(fallback,  Mim.fromHead(head, fallback))
    })

    it('object', () => {
      head = {}
      equal(empty,     Mim.fromHead(head))
      equal(fallback,  Mim.fromHead(head, fallback))

      head[ Mim.CT ] = type
      equal(type,      Mim.fromHead(head))
    })

    it('map', () => {
      head = new Map
      equal(empty,     Mim.fromHead(head))
      equal(fallback,  Mim.fromHead(head, fallback))

      head.set(Mim.CT, type)
      equal(type,      Mim.fromHead(head))
    })
  })

  describe('is', () => {
    it('string', () => {
      equal(true,  Mim.is('svg', Mim.svg))
      equal(false, Mim.is('svg', Mim.xml))
    })

    it('object', () => {
      equal(true,  Mim.is('css', { [ Mim.CT ]: Mim.css }))
      equal(false, Mim.is('ico', { [ Mim.CT ]: Mim.css }))
    })

    it('map', () => {
      equal(true,  Mim.is('xml',  new Map([[ Mim.CT, Mim.xml ]])))
      equal(false, Mim.is('json', new Map([[ Mim.CT, Mim.xml ]])))
    })
  })

  describe('extname', () => {
    let ex = 'woff'
    const path = '/dir/name'


    it('extname', () => {
      equal(ex,  Mim.extname(       '.' + ex))
      equal(ex,  Mim.extname(path + '.' + ex))
    })

    it('extname:url', () => {
      equal(ex,  Mim.extname(new URL(       '.' + ex, 'file:')))
      equal(ex,  Mim.extname(new URL(path + '.' + ex, 'file:')))
    })

  })

})
