treemapDiagram(window.d3).catch(console.error);

async function treemapDiagram(d3) {
  const movieData = await d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  );

  const margin = { top: 120, right: 20, bottom: 20, left: 20 };
  const width = 800;
  const height = 800;

  const root = d3.select("#root");

  const svg = root.append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "centered");

  svg.selectAll("text")
    .data([
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
    ])
    .join("text")
    .attr("id", d => d.id)
    .attr("text-anchor", "middle")
    .attr("x", svg.attr("width") * 0.5)
    .attr("y", d => d.y)
    .text(d => d.text);

  const movieDomain = movieData.children.map(child => child.name);
  const color = d3.scaleOrdinal(movieDomain, d3.schemeCategory10);

  const rootNode = d3.hierarchy(movieData)
    .sum(d => d.value)
    .sort((a, b) => (b.value - a.value));

  const treemap = d3.treemap()
    .size([width, height])
    .padding(0.8);

  const tileData = treemap(rootNode).leaves();

  const tooltip = Tooltip(
    root,
    "data-value",
    d => d.data.value,
    d => `${d.data.name}<br>${d3.format("$,")(d.data.value)}`,
  );
  tooltip().attr("id", "tooltip");

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const tiles = chart.selectAll("g")
    .data(tileData)
    .join("g")
    .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  tiles.append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("width", d => (d.x1 - d.x0))
    .attr("height", d => (d.y1 - d.y0))
    .attr("fill", d => color(d.data.category))
    .on("mousemove", tooltip.show)
    .on("mouseout", tooltip.hide);

  const itemWidth = 110;
  const swatchSize = 12;
  const swatchSpacing = 5;

  const legend = svg.append("g")
    .attr("id", "legend")
    .attr(
      "transform",
      `translate(
        ${(svg.attr("width") / 2) - (itemWidth * color.domain().length / 2)},
        ${margin.top * 0.85}
      )`,
    );

  const legendItems = legend.selectAll("g")
    .data(color.domain())
    .join("g");

  legendItems.append("rect")
    .attr("class", "legend-item")
    .attr("x", (d, i) => i * itemWidth)
    .attr("y", 0)
    .attr("width", swatchSize)
    .attr("height", swatchSize)
    .attr("fill", d => color(d));

  legendItems.append("text")
    .attr("x", (d, i) => i * itemWidth + swatchSize + swatchSpacing)
    .attr("y", 0)
    .attr("dy", ".71em")
    .text(d => d);

  function Tooltip(
    selection,
    dataName,
    dataValueFn,
    htmlContentFn,
    left = 20,
    top = 20,
  ) {
    const div = selection.append("div")
      .style("position", "absolute")
      .style("z-index", 10)
      .style("display", "none");

    const tooltip = () => div;

    tooltip.show = (event, data) => {
      div.attr(dataName, dataValueFn(data))
        .html(htmlContentFn(data))
        .style("left", `${(event.pageX + left)}px`)
        .style("top", `${(event.pageY + top)}px`)
        .style("display", "block");
    };

    tooltip.hide = () => div.style("display", "none");

    return tooltip;
  }
}
