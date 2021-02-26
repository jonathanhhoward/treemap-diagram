treemapDiagram(window.d3).catch(console.error);

async function treemapDiagram(d3) {
  const movieData = await d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  );
  console.log(movieData);

  const margin = { top: 100, right: 20, bottom: 20, left: 20 };
  const width = 954 + margin.right + margin.left;
  const height = 954 + margin.top + margin.bottom;

  const root = d3.select("#root");

  const svg = root.append("svg")
    .attr("width", width)
    .attr("height", height)
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
}
