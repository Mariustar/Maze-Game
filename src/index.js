import Matter, { Engine, Render, Runner, World, Bodies } from "matter-js";
import "./main.css";

//! Create Engine
// @ts-ignore
const engine = Engine.create({ positionIterations: 20, velocityIterations: 20 });
const world = engine.world;

const cells = 5;
const width = 1500;
const height = 900;

const render = Render.create({
  element: document.getElementById("game-container"),
  engine: engine,
  options: {
    width,
    height,
    wireframes: false,
    wireframeBackground: `#14151f`,
    background: "lightgray",
  },
});

Render.run(render);
Runner.run(Runner.create(), engine);

//! Walls
const walls = [
  Bodies.rectangle(width / 2, 0, width, 50, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(width, height / 2, 50, height, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(width / 2, height, width, 50, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(0, height / 2, 50, height, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
];
World.add(world, walls);

//! Maze generation

const shuffle = (arr) => {
  let counter = arr.length;

  while (counter > 0) {
    const index = Math.floor(Math.random() * counter);

    counter--;
    const temp = arr[counter];
    arr[counter] = arr[index];
    arr[index] = temp;
  }

  return arr;
};

const grid = Array(cells)
  .fill(null)
  .map(() => Array(cells).fill(false));

const verticals = Array(cells)
  .fill(null)
  .map(() => Array(cells - 1).fill(false));

const horizontals = Array(cells - 1)
  .fill(null)
  .map(() => Array(cells).fill(false));

const startRow = Math.floor(Math.random() * cells);
const startCol = Math.floor(Math.random() * cells);

const stepThroughCell = (row, column) => {
  // If i have visited the cell at [row. col], return
  if (grid[row][column] === true) {
    return;
  }
  // Mark this cell as being visited
  grid[row][column] = true;

  // Assemble randomly-ordered lsit of neighbors

  const neighbors = shuffle([
    [startRow - 1, startCol],
    [startRow, startCol + 1],
    [startRow + 1, startCol],
    [startRow, startCol - 1],
  ]);
  console.log(neighbors);

  // for (let i = 0; i < neighbors.length; i++) {
  //   for (let j = 0; j < neighbors[i].length; j++) {
  //     if (neighbors[i][j] > cells - 1 || neighbors[i][j] < 0) {
  //       console.log(`Out of bounds at ${neighbors[i][j]}`);
  //     }
  //   }
  // }

  // For each neighbor
  // See if that neighbor is out of bounds
  // If we have visited that neighbor, continue to next neighbor
  // Remove a wall from either horizontal or vertical array
  // Visit that next cell
};

stepThroughCell(startRow, startCol);
console.log(grid);
