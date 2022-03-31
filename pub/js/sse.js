// import O    from '/util/define.js'
// import Is   from '/util/is.js'
// import $    from '/js/dom.js'
// import Sync from '/js/sync.js'

const sse = new EventSource(location.origin + '/api/stream')
export default sse

const log = (s, ...a) => console.log('[SSE:%s]', s, ...a)

sse.onmessage = e => {
  log(e.type ?? '-', e.data)
}

sse.addEventListener('message', e => {
  log(`#${ e.type ?? '-' }`, e.data)
})

sse.addEventListener('open', e => {
  log('OPEN', e)
})

sse.addEventListener('ping', e => {
  log('PING', e.data)
})

sse.addEventListener('change', e => {
  log('CHANGE', e.data)
})

sse.addEventListener('error', e => {
  log(e.readyState == EventSource.CLOSED
    ? 'CLOSED'
    : 'ERROR', e)
})
