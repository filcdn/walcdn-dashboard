---
toc: false
---

```js
import { LineGraph } from './components/line-graph.js'
import { WorldMap } from './components/maps.js'

const DailyRequests = FileAttachment('./data/daily-requests.json').json()
const DailyEgress = FileAttachment('./data/daily-egress.json').json()
const RequestGeodistribution = FileAttachment(
  './data/request-geodistribution.json',
).json()
const Countries = FileAttachment('./data/countries.geojson').json()
const ResponseCodeBreakdown = FileAttachment(
  './data/response-code-breakdown.json',
).json()
```

<div class="hero">
  <body><a href="https://filcdn.com" target="_blank" rel="noopener noreferrer"><img src="media/filcdn-logo.png" alt="FilCDN Logo" width="300" /></a><body>
    <h2>FilCDN Dashboard</h2>
</div>

<h4>Daily Stats</h4>

<div class="grid grid-cols-2" style="grid-auto-rows: 500px;">
  <div class="card">${
    resize((width) => LineGraph(DailyRequests, {width, title: "Daily Requests", xKey: "day", yKey: "total_requests", label: "Daily Requests" }))
  }</div>
  <div class="card">${
    resize((width) => LineGraph(DailyEgress, {width, title: "Daily Egress", xKey: "day", yKey: "total_egress", label: "Daily Egress" }))
  }</div>
</div>

<div class="grid grid-cols-2" style="grid-auto-rows: 500px;">
  <div>
    <h4>Response Codes</h4>
    <body>This section shows the response codes breakdown.</body>
    <div class="card">
      ${Plot.plot({
        x: {label: null, type: "band", ticks: "week" },
        y: {
        percent: true
        },
        color: {
        scheme: "Accent",
        legend: "swatches",
        label: "code"
        },
        marks: [
        Plot.rectY(ResponseCodeBreakdown.map((d) => ({
            ...d,
            day: new Date(d.day),
        })),
        {
            x: "day",
            y: "rate",
            fill: "code",
            offset: "normalize",
            sort: {color: null, x: "-y" },
            interval: 'day',
            tip: {
            format: {
                x: d => new Date(d).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
                }),
                y: v => v.toFixed(2),
                code: true
          }
        }
    })
    ]
})}
    </div>
  </div>
</div>

<div class="grid">
  ${
    resize((width) => WorldMap(Countries, RequestGeodistribution, { width, label: "Requests by Country" }))
  }
</div>

<style>
.card-figure {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0;
  font-size: 4vw;
  color: #E30ADA;
}

.hero {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--sans-serif);
  margin: 4rem 0 8rem;
  text-wrap: balance;
  text-align: center;
}

.hero h1 {
  margin: 1rem 0;
  padding: 1rem 0;
  max-width: none;
  font-size: 14vw;
  font-weight: 900;
  line-height: 1;
  background: linear-gradient(30deg, var(--theme-foreground-focus), currentColor);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero h2 {
  margin: 0;
  max-width: 34em;
  font-size: 20px;
  font-style: initial;
  font-weight: 500;
  line-height: 1.5;
  color: var(--theme-foreground-muted);
}

.hero img {
  max-width: 20%;
}

@media (min-width: 640px) {
  .hero h1 {
    font-size: 90px;
  }
}

</style>
