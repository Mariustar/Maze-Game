import Matter, { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } from "matter-js";
import "./main.css";

//! Create Engine
// @ts-ignore
const engine = Engine.create({ positionIterations: 20, velocityIterations: 20 });
const world = engine.world;

const width = 1000;
const height = 800;

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

World.add(
  world,
  MouseConstraint.create(engine, {
    mouse: Mouse.create(render.canvas),
  }),
);

//! Walls
const walls = [
  Bodies.rectangle(500, 0, 1000, 50, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(1000, 400, 50, 800, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(500, 800, 1000, 50, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
  Bodies.rectangle(0, 400, 50, 800, {
    isStatic: true,
    render: {
      fillStyle: "black",
    },
  }),
];

for (let i = 0; i <= 95; i++) {
  if (Math.random() < 0.3) {
    World.add(
      world,
      Bodies.polygon(Math.random() * width, Math.random() * height, 30, 45, {
        render: {
          fillStyle: "#A52A2A",
          lineWidth: 3,
          strokeStyle: "black",
        },
      }),
    );
  } else if (Math.random() < 0.6) {
    World.add(
      world,
      Bodies.rectangle(Math.random() * width, Math.random() * height, 70, 70, {
        render: {
          fillStyle: "#6495ED",
          lineWidth: 3,
          strokeStyle: "black",
        },
      }),
    );
  } else {
    World.add(
      world,
      Bodies.polygon(Math.random() * width, Math.random() * height, 3, 50, {
        render: {
          fillStyle: "#2F4F4F",
          lineWidth: 3,
          strokeStyle: "black",
        },
      }),
    );
  }
}
World.add(world, walls);
