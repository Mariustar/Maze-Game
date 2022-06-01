import { Engine, Render, Runner, World, Bodies } from "matter-js";
import "./main.css";

//! Create Engine
// @ts-ignore
const engine = Engine.create({ positionIterations: 20, velocityIterations: 20 });
const world = engine.world;

const cells = 3;
const width = 900;
const height = 900;

const unitLength = width / cells;

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
  Bodies.rectangle(width / 2, 0, width, 20, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(width, height / 2, 20, height, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(width / 2, height, width, 20, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(0, height / 2, 20, height, {
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
    [row - 1, column, "up"],
    [row, column + 1, "right"],
    [row + 1, column, "down"],
    [row, column - 1, "left"],
  ]);

  // For each neighbor
  for (let neighbor of neighbors) {
    const [nextRow, nextColumn, direction] = neighbor;
    // See if that neighbor is out of bounds
    if (nextRow < 0 || nextRow >= cells || nextColumn < 0 || nextColumn >= cells) {
      continue;
    }

    // If we have visited that neighbor, continue to next neighbor
    if (grid[nextRow][nextColumn]) {
      continue;
    }
    // Remove a wall from either horizontal or vertical array

    if (direction === "left") {
      verticals[row][column - 1] = true;
    } else if (direction === "right") {
      verticals[row][column] = true;
    } else if (direction === "up") {
      horizontals[row - 1][column] = true;
    } else if (direction === "down") {
      horizontals[row][column] = true;
    }

    stepThroughCell(nextRow, nextColumn);
  }
  // Visit that next cell
};

stepThroughCell(startRow, startCol);

horizontals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength / 2,
      rowIndex * unitLength + unitLength,
      unitLength + 9,
      10,
      {
        isStatic: true,
      },
    );

    World.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLength + unitLength,
      rowIndex * unitLength + unitLength / 2,
      10,
      unitLength + 9,
      {
        isStatic: true,
      },
    );

    World.add(world, wall);
  });
});

const goal = Bodies.rectangle(
  width - unitLength / 2,
  height - unitLength / 2,
  unitLength * 0.7,
  unitLength * 0.7,
  {
    isStatic: true,
    render: {
      fillStyle: "red",
    },
  },
);

World.add(world, goal);
