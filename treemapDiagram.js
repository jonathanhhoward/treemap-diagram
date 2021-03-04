import { Tooltip } from "./tooltip.js";

treemapDiagram(window.d3).catch(console.error);

async function treemapDiagram(d3) {
  const margin = { top: 120, right: 20, bottom: 20, left: 20 };
  const width = 800;
  const height = 800;
  const root = d3.select("#root");
  const svg = root.append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "centered");

  header(
    svg,
    {
      id: "title",
      text: "Movie Sales",
      y: margin.top * 0.5,
    },
    {
      id: "description",
      text: "Top 100 Highest Grossing Movies Grouped By Genre",
      y: margin.top * 0.7,
    },
  );

  const movieData = await d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  );
  const movieDomain = movieData.children.map(child => child.name);
  const color = d3.scaleOrdinal(movieDomain, d3.schemeCategory10);
  const itemWidth = 110;
  const legendWidth = itemWidth * color.domain().length;

  legend(
    svg,
    color,
    svg.attr("width") / 2 - legendWidth / 2,
    margin.top * 0.85,
  );

  const treemap = d3.treemap()
    .size([width, height])
    .padding(0.8);
  const rootNode = treemap(
    d3.hierarchy(movieData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value),
  );
  const tooltip = new Tooltip(
    root,
    "data-value",
    d => d.data.value,
    d => `${d.data.name}<br>${d3.format("$,")(d.data.value)}`,
  );

  tiles(
    svg,
    margin.left,
    margin.top,
    rootNode.leaves(),
    color,
    tooltip,
  );

  function header(selection, title, description) {
    selection.selectAll("text")
      .data([title, description])
      .join("text")
      .attr("id", d => d.id)
      .attr("text-anchor", "middle")
      .attr("x", selection.attr("width") * 0.5)
      .attr("y", d => d.y)
      .text(d => d.text);
  }

  function legend(
    selection,
    color,
    dx,
    dy,
    itemWidth = 110,
    swatchSize = 12,
    swatchSpacing = 5,
  ) {
    const legend = selection.append("g")
      .attr("id", "legend")
      .attr("transform", `translate(${dx}, ${dy})`);

    const items = legend.selectAll("g")
      .data(color.domain())
      .join("g");

    items.append("rect")
      .attr("class", "legend-item")
      .attr("x", (d, i) => i * itemWidth)
      .attr("y", 0)
      .attr("width", swatchSize)
      .attr("height", swatchSize)
      .attr("fill", d => color(d));

    items.append("text")
      .attr("x", (d, i) => i * itemWidth + swatchSize + swatchSpacing)
      .attr("y", 0)
      .attr("dy", ".71em")
      .text(d => d);
  }

  function tiles(selection, dx, dy, data, color, tooltip) {
    selection.append("g")
      .attr("transform", `translate(${dx}, ${dy})`)
      .selectAll("g")
      .data(data)
      .join("g")
      .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
      .append("rect")
      .attr("class", "tile")
      .attr("data-name", d => d.data.name)
      .attr("data-category", d => d.data.category)
      .attr("data-value", d => d.data.value)
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0)
      .attr("fill", d => color(d.data.category))
      .on("mousemove", tooltip.show)
      .on("mouseout", tooltip.hide);
  }
}
