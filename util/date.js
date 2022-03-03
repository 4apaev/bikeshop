export const Units = [
  [ 'year', 31536000000 ], // 60 * 60 * 24 * 365
  [ 'month', 2628000000 ], // 60 * 60 * 24 * 365 / 12
  [ 'day', 86400000 ],     // 60 * 60 * 24
  [ 'hour', 3600000 ],     // 60 * 60
  [ 'minute', 60000 ],     // 60
  [ 'second', 1000 ],      // 1
]

export const DTF = new Intl.DateTimeFormat([], {
  year: 'numeric',
  month: 'short',
  weekday: 'short',

  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',

  hourCycle: 'h23',
  dayPeriod: 'long',
  era: 'long',
})

export function date(d) {
  return DTF.format(d ?? new Date)
}

export function range(a, b = Date.now()) {
  a > b || ([ a, b ] = [ b, a ])
  return period(b - a)
}

export function period(ms) {
  const buf = []
  for (const [ unit, value ] of Units) {
    const x = ms / value
    const i =  0 | x
    if (i) {
      buf.push(i.toLocaleString('en', {
        unit,
        style: 'unit',
        unitDisplay: 'long',
      }))
      ms = (x - i) * value
    }
  }
  return buf
}

