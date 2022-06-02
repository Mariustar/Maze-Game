import Matter, { Engine, Render, Runner, World, Bodies, Body, Events } from "matter-js";
import "./main.css";

//! Create Engine
// @ts-ignore
const engine = Engine.create({ positionIterations: 20, velocityIterations: 20 });
engine.world.gravity.y = 0;
// engine.gravity.x = 0;
const composite = Matter.Composite;
const world = engine.world;

const cellsHorizontal = 15;
const cellsVertical = 12;
const width = window.innerWidth;
const height = window.innerHeight;

const unitLengthX = width / cellsHorizontal;
const unitLengthY = width / cellsVertical;

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

const grid = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const verticals = Array(cellsVertical)
  .fill(null)
  .map(() => Array(cellsHorizontal - 1).fill(false));

const horizontals = Array(cellsVertical - 1)
  .fill(null)
  .map(() => Array(cellsHorizontal).fill(false));

const startRow = Math.floor(Math.random() * cellsVertical);
const startCol = Math.floor(Math.random() * cellsHorizontal);

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
    if (
      nextRow < 0 ||
      nextRow >= cellsVertical ||
      nextColumn < 0 ||
      nextColumn >= cellsHorizontal
    ) {
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
      columnIndex * unitLengthX + unitLengthX / 2,
      rowIndex * unitLengthY + unitLengthY,
      unitLengthX + 9,
      10,
      {
        label: "wall",
        isStatic: true,
      },
    );

    // World.add(world, wall);
    composite.add(world, wall);
  });
});

verticals.forEach((row, rowIndex) => {
  row.forEach((open, columnIndex) => {
    if (open) {
      return;
    }

    const wall = Bodies.rectangle(
      columnIndex * unitLengthX + unitLengthX,
      rowIndex * unitLengthY + unitLengthY / 2,
      10,
      unitLengthY + 9,
      {
        label: "wall",
        isStatic: true,
      },
    );

    // World.add(world, wall);
    composite.add(world, wall);
  });
});

const goal = Bodies.rectangle(
  width - unitLengthX / 2,
  height - unitLengthY / 2,
  unitLengthX * 0.7,
  unitLengthY * 0.7,
  {
    isStatic: true,
    label: "goal",
    render: {
      fillStyle: "green",
    },
  },
);
composite.add(world, goal);

const ballRadius = Math.min(unitLengthX, unitLengthY) / 4;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, {
  isStatic: false,
  label: "ball",
  render: {
    fillStyle: "blue",
  },
});

composite.add(world, ball);

// document.addEventListener("keydown", (event) => {
//   const { x, y } = ball.velocity;
//   if (event.key === "w") {
//     Body.setVelocity(ball, { x, y: y - 5 });
//   }
//   if (event.key === "a") {
//     Body.setVelocity(ball, { x: x - 5, y });
//   }
//   if (event.key === "s") {
//     Body.setVelocity(ball, { x, y: y + 5 });
//   }
//   if (event.key === "d") {
//     Body.setVelocity(ball, { x: x + 5, y });
//   }
// });

const keyHandlers = {
  KeyW: () => {
    Body.applyForce(
      ball,
      {
        x: ball.position.x,
        y: ball.position.y,
      },
      { x: 0, y: -0.008 },
    );
  },
  KeyA: () => {
    Body.applyForce(
      ball,
      {
        x: ball.position.x,
        y: ball.position.y,
      },
      { x: -0.008, y: 0 },
    );
  },
  KeyS: () => {
    Body.applyForce(
      ball,
      {
        x: ball.position.x,
        y: ball.position.y,
      },
      { x: 0, y: 0.008 },
    );
  },
  KeyD: () => {
    Body.applyForce(
      ball,
      {
        x: ball.position.x,
        y: ball.position.y,
      },
      { x: 0.008, y: 0 },
    );
  },
};

const keysDown = new Set();
document.addEventListener("keydown", (event) => {
  keysDown.add(event.code);
});
document.addEventListener("keyup", (event) => {
  keysDown.delete(event.code);
});

Events.on(engine, "beforeUpdate", (event) => {
  [...keysDown].forEach((k) => {
    keyHandlers[k]?.();
  });
});

composite.add(engine.world, walls);

//! Win condition

Events.on(engine, "collisionStart", (event) => {
  event.pairs.forEach((collision) => {
    const labels = ["ball", "goal"];
    if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
      engine.gravity.y = 0.1;
      world.bodies.forEach((body) => {
        if (body.label === "wall") {
          Body.setStatic(body, false);
        }
      });
    }
  });
});

console.log(world.bodies);
