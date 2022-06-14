// https://observablehq.com/@mbostock/bar-chart-race-with-scrubber@3091
import define1 from "./450051d7f1174df8@254.js";

function _1111(md){return(
md`#     Bar Chart Race with Scrubber

This chart animates the value (in $M) of the top global brands from 2000 to 2019. Color indicates sector. See [the explainer](/d/e9e3929cf7c50b45) for more. This fork uses a [scrubber](/@mbostock/scrubber) for interactive control. Data: [Interbrand](https://www.interbrand.com/best-brands/)`
)}

function _keyframe(Scrubber,keyframes,formatDate,duration){return(
Scrubber(keyframes, {
  format: ([date]) => formatDate(date),
  delay: duration,
  loop: false
})
)}

function _chart(d3,width,height,bars,axis,labels,ticker,invalidation,duration,x)
{
  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height]);

  const updateBars = bars(svg);
  const updateAxis = axis(svg);
  const updateLabels = labels(svg);
  const updateTicker = ticker(svg);

  invalidation.then(() => svg.interrupt());

  return Object.assign(svg.node(), {
    update(keyframe) {
      const transition = svg.transition()
          .duration(duration)
          .ease(d3.easeLinear);

      // Extract the top bar’s value.
      x.domain([0, keyframe[1][0].value]);

      updateAxis(keyframe, transition);
      updateBars(keyframe, transition);
      updateLabels(keyframe, transition);
      updateTicker(keyframe, transition);
    }
  });
}


function _update(chart,keyframe){return(
chart.update(keyframe)
)}

function _data(FileAttachment){return(
FileAttachment("category-brands.csv").csv({typed: true})
)}

function _duration(){return(
250
)}

function _n(){return(
12
)}

function _names(data){return(
new Set(data.map(d => d.name))
)}

function _datevalues(d3,data){return(
Array.from(d3.rollup(data, ([d]) => d.value, d => +d.date, d => d.name))
  .map(([date, data]) => [new Date(date), data])
  .sort(([a], [b]) => d3.ascending(a, b))
)}

function _rank(names,d3,n){return(
function rank(value) {
  const data = Array.from(names, name => ({name, value: value(name)}));
  data.sort((a, b) => d3.descending(a.value, b.value));
  for (let i = 0; i < data.length; ++i) data[i].rank = Math.min(n, i);
  return data;
}
)}

function _k(){return(
10
)}

function _keyframes(d3,datevalues,k,rank)
{
  const keyframes = [];
  let ka, a, kb, b;
  for ([[ka, a], [kb, b]] of d3.pairs(datevalues)) {
    for (let i = 0; i < k; ++i) {
      const t = i / k;
      keyframes.push([
        new Date(ka * (1 - t) + kb * t),
        rank(name => (a.get(name) || 0) * (1 - t) + (b.get(name) || 0) * t)
      ]);
    }
  }
  keyframes.push([new Date(kb), rank(name => b.get(name) || 0)]);
  return keyframes;
}


function _bars(n,color,y,x){return(
function bars(svg) {
  let bar = svg.append("g")
      .attr("fill-opacity", 0.6)
    .selectAll("rect");

  return ([date, data], transition) => bar = bar
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("rect")
        .attr("fill", color)
        .attr("height", y.bandwidth())
        .attr("x", x(0))
        .attr("y", y(n))
        .attr("width", d => x(d.value) - x(0)),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("y", y(n))
        .attr("width", d => x(d.value) - x(0))
    )
    .call(bar => bar.transition(transition)
      .attr("y", d => y(d.rank))
      .attr("width", d => x(d.value) - x(0)));
}
)}

function _labels(n,x,y,textTween,parseNumber){return(
function labels(svg) {
  let label = svg.append("g")
      .style("font", "bold 12px var(--sans-serif)")
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
    .selectAll("text");

  return ([date, data], transition) => label = label
    .data(data.slice(0, n), d => d.name)
    .join(
      enter => enter.append("text")
        .attr("transform", d => `translate(${x(d.value)},${y(n)})`)
        .attr("y", y.bandwidth() / 2)
        .attr("x", -6)
        .attr("dy", "-0.25em")
        .text(d => d.name)
        .call(text => text.append("tspan")
          .attr("fill-opacity", 0.7)
          .attr("font-weight", "normal")
          .attr("x", -6)
          .attr("dy", "1.15em")),
      update => update,
      exit => exit.transition(transition).remove()
        .attr("transform", d => `translate(${x(d.value)},${y(n)})`)
    )
    .call(bar => bar.transition(transition)
      .attr("transform", d => `translate(${x(d.value)},${y(d.rank)})`)
      .call(g => g.select("tspan").tween("text", function(d) {
          return textTween(parseNumber(this.textContent), d.value);
        })));
}
)}

function _textTween(d3,formatNumber){return(
function textTween(a, b) {
  const i = d3.interpolateNumber(a, b);
  return function(t) {
    this.textContent = formatNumber(i(t));
  };
}
)}

function _parseNumber(){return(
string => +string.replace(/,/g, "")
)}

function _formatNumber(d3){return(
d3.format(",d")
)}

function _axis(margin,d3,x,width,barSize,n,y){return(
function axis(svg) {
  const g = svg.append("g")
      .attr("transform", `translate(0,${margin.top})`);

  const axis = d3.axisTop(x)
      .ticks(width / 160)
      .tickSizeOuter(0)
      .tickSizeInner(-barSize * (n + y.padding()));

  return (_, transition) => {
    g.transition(transition).call(axis);
    g.select(".tick:first-of-type text").remove();
    g.selectAll(".tick:not(:first-of-type) line").attr("stroke", "white");
    g.select(".domain").remove();
  };
}
)}

function _ticker(barSize,width,margin,n,formatDate,keyframes){return(
function ticker(svg) {
  const now = svg.append("text")
      .style("font", `bold ${barSize}px var(--sans-serif)`)
      .style("font-variant-numeric", "tabular-nums")
      .attr("text-anchor", "end")
      .attr("x", width - 6)
      .attr("y", margin.top + barSize * (n - 0.45))
      .attr("dy", "0.32em")
      .text(formatDate(keyframes[0][0]));

  return ([date], transition) => {
    transition.end().then(() => now.text(formatDate(date)));
  };
}
)}

function _formatDate(d3){return(
d3.utcFormat("%Y")
)}

function _color(d3,data)
{
  const scale = d3.scaleOrdinal(d3.schemeTableau10);
  if (data.some(d => d.category !== undefined)) {
    const categoryByName = new Map(data.map(d => [d.name, d.category]))
    scale.domain(categoryByName.values());
    return d => scale(categoryByName.get(d.name));
  }
  return d => scale(d.name);
}


function _x(d3,margin,width){return(
d3.scaleLinear([0, 1], [margin.left, width - margin.right])
)}

function _y(d3,n,margin,barSize){return(
d3.scaleBand()
    .domain(d3.range(n + 1))
    .rangeRound([margin.top, margin.top + barSize * (n + 1 + 0.1)])
    .padding(0.1)
)}

function _height(margin,barSize,n){return(
margin.top + barSize * n + margin.bottom
)}

function _barSize(){return(
48
)}

function _margin(){return(
{top: 16, right: 6, bottom: 6, left: 0}
)}

function _d3(require){return(
require("d3@6")
)}

export default function race_define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["category-brands.csv", {url: new URL("./race_files/genre_csv.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  //main.variable(observer()).define(["md"], _1111);
  main.variable(observer("viewof keyframe")).define("viewof keyframe", ["Scrubber","keyframes","formatDate","duration"], _keyframe);
  main.variable("keyframe").define("keyframe", ["Generators", "viewof keyframe"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["d3","width","height","bars","axis","labels","ticker","invalidation","duration","x"], _chart);
  main.variable("update").define("update", ["chart","keyframe"], _update);
  main.variable("data").define("data", ["FileAttachment"], _data);
  main.variable("duration").define("duration", _duration);
  main.variable("n").define("n", _n);
  main.variable("names").define("names", ["data"], _names);
  main.variable("datevalues").define("datevalues", ["d3","data"], _datevalues);
  main.variable("rank").define("rank", ["names","d3","n"], _rank);
  main.variable("k").define("k", _k);
  main.variable("keyframes").define("keyframes", ["d3","datevalues","k","rank"], _keyframes);
  main.variable("bars").define("bars", ["n","color","y","x"], _bars);
  main.variable("labels").define("labels", ["n","x","y","textTween","parseNumber"], _labels);
  main.variable("textTween").define("textTween", ["d3","formatNumber"], _textTween);
  main.variable("parseNumber").define("parseNumber", _parseNumber);
  main.variable("formatNumber").define("formatNumber", ["d3"], _formatNumber);
  main.variable("axis").define("axis", ["margin","d3","x","width","barSize","n","y"], _axis);
  main.variable("ticker").define("ticker", ["barSize","width","margin","n","formatDate","keyframes"], _ticker);
  main.variable("formatDate").define("formatDate", ["d3"], _formatDate);
  main.variable("color").define("color", ["d3","data"], _color);
  main.variable("x").define("x", ["d3","margin","width"], _x);
  main.variable("y").define("y", ["d3","n","margin","barSize"], _y);
  main.variable("height").define("height", ["margin","barSize","n"], _height);
  main.variable("barSize").define("barSize", _barSize);
  main.variable("margin").define("margin", _margin);
  main.variable("d3").define("d3", ["require"], _d3);
  const child1 = runtime.module(define1);
  main.import("Scrubber", child1);
  return main;
}
