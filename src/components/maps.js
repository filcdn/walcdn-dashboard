import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function WorldMap(countries, data, { width = 800, height = 600 } = {}) {
    const lookupIndex = d3.index(data, d => d.country);

    return Plot
    .geo(countries, {
        fill: (d) => lookupIndex.get(d.properties.adm0_a3_is)?.count,
        stroke: "white",
        strokeWidth: 0.2
    })
    .plot({
        width,
        height,
        projection: "equirectangular",
        color: { scheme: "blues", unknown: "#ccc", legend: true, label: "Requests by Country" },
    })
}
