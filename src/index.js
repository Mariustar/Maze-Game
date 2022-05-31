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

console.log(startRow, startCol);

const stepThroughCell = (row, column) => {
  // If i have visited the cell at [row. col], return
  // Mark this cell as being visited
  // Assemble randomly-ordered lsit of neighbors
  // For each neighbor
  // See if that neighbor is out of bounds
  // If we have visited that neighbor, continue to next neighbor
  // Remove a wall from either horizontal or vertical array
  // Visit that next cell
};

stepThroughCell(startRow, startCol);
