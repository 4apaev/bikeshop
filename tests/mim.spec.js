import { deepStrictEqual as equal } from 'assert'
import * as Mim from '../wheels/mim.js'

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

  it('fromFile', () => {
    equal(Mim.fromFile('/a/b/img.png'), Mim.png)
    equal(Mim.fromFile(new URL('file://path/to/file.zip')), Mim.zip)
  })

  it('fromHead', () => {
    const txt = 'txt'
    const head = new Map

    equal(Mim.fromHead(head, txt), txt)
    equal(Mim.fromHead(Object.fromEntries(head), txt), txt)

    head.set(Mim.CT, Mim.json)

    equal(Mim.fromHead(head, txt), Mim.json)
    equal(Mim.fromHead(Object.fromEntries(head), txt), Mim.json)
  })

  it('is', () => {
    equal(Mim.is('svg', Mim.svg), true)
    equal(Mim.is('svg', Mim.xml), false)

    equal(Mim.is('css', { [ Mim.CT ]: Mim.css }), true)
    equal(Mim.is('ico', { [ Mim.CT ]: Mim.css }), false)

    equal(Mim.is('xml', new Map([[ Mim.CT, Mim.xml ]])), true)
    equal(Mim.is('json', new Map([[ Mim.CT, Mim.xml ]])), false)
  })
})
