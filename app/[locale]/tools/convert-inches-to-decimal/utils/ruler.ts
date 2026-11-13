interface RulerWindowOptions {
  value?: number
  span: number
}

/** Keep a fixed number of ticks while moving the visible window around larger measurements. */
export function getRulerWindow({ value, span }: RulerWindowOptions) {
  const start = value !== undefined && value > span ? Math.floor(value - span / 2) : 0
  const end = start + span
  const offset = value === undefined ? null : value - start
  return { start, end, offset }
}
