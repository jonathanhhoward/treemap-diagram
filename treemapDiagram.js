treemapDiagram(window.d3).catch(console.error);

async function treemapDiagram(d3) {
  const movieData = await d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json",
  );
  console.log(movieData);

  const margin = { top: 100, right: 20, bottom: 20, left: 20 };
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
        y: margin.top * 0.75,
      },
    ])
    .join("text")
    .attr("id", d => d.id)
    .attr("x", width * 0.5)
    .attr("y", d => d.y)
    .text(d => d.text);

  const color = d3.scaleOrdinal(d3.schemeCategory10);

  const treemap = d3.treemap()
    .paddingOuter(1)
    .size([width, height]);

  const rootNode = treemap(
    d3.hierarchy(movieData)
      .sum(d => d.value)
      .sort((a, b) => (b.value - a.value)),
  );
  console.log(rootNode);

  const chart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const tiles = chart.selectAll("g")
    .data(rootNode.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0}, ${d.y0})`);

  tiles.append("rect")
    .attr("class", "tile")
    .attr("data-name", d => d.data.name)
    .attr("data-category", d => d.data.category)
    .attr("data-value", d => d.data.value)
    .attr("width", d => (d.x1 - d.x0))
    .attr("height", d => (d.y1 - d.y0))
    .attr("fill", d => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr("stroke", "white");
}
