/* eslint-disable no-unused-vars */
import $ from './dom.js'

export function edit() {
  const ico = $('#icon')
  const svg =  ico?.first?.getSVGDocument?.()

  if (!svg)
    return console.warn('svg icon not found')

  let curr
  const dialog = ico.last

  const pre = dialog.$('pre')
  const color = dialog.$('[name=color]')
  const round = dialog.$('#round')
  const reset = dialog.$('#reset')

  color.on('input', e => {
    curr?.attr?.({ fill: e.target.value })
  })

  reset.on('click', e => {
    dialog.close()
  })

  round.on('click', e => {
    let d = curr?.attr('d')
    curr?.attr('d', pre.text = d.replace(/(\d+\.\d+)/g, Math.round))
  })

  svg.on('click', 'path', e => {
    curr = e.target
    dialog.showModal()
    pre.text = curr.attr('d')
    color.value = curr.attr('fill')
  })

}

document.addEventListener('DOMContentLoaded', () => {
  setTimeout(edit, 100)
})
