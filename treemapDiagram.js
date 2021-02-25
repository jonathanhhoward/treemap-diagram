treemapDiagram().catch(console.error);

async function treemapDiagram() {
  const movieData = await d3.json(
    "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json"
  );
  console.log(movieData);
}
