// import O    from '/util/define.js'
// import Is   from '/util/is.js'
import $ from '/js/dom.js'
// import Sync from '/js/sync.js'

const log = s => e => {
  console.group('[📡:%s]', s)
  console.log(e)
  console.log(e.type)
  console.log(e.data)
  console.groupEnd()
}

export default function SSE(path) {
  path ??= $('meta[name="sse-path"]').get('content')
  const sse = SSE.sse = new EventSource(new URL(path, location.origin))

  const open = log('📭 Open')
  sse.addEventListener('open', e => {
    open(e)

  }, false)
  sse.addEventListener('error', log('📛🎙 Error'), false)

  sse.addEventListener('message', log('🎙 Message'), false)
  sse.addEventListener('ping', log('🏓 Ping'), false)
  sse.addEventListener('change', log('👛 Change'), false)
  return sse
}

