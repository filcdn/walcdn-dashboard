import * as Plot from 'npm:@observablehq/plot'

export function LineGraph(
  events,
  { width, height, title, xKey, yKey, label, millions } = {},
) {
  return Plot.plot({
    title,
    width,
    height,
    x: { type: 'utc', label: null },
    y: { grid: true, inset: 10, label },
    marks: [
      Plot.lineY(events, {
        x: xKey,
        y: millions ? (d) => d[yKey] / 1e6 : yKey,
        stroke: '#4FF8C9',
      }),
    ],
  })
}
