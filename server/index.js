const express = require("express");

const app = express();
const server = require("http").Server(app);

const PORT = 1506;

const io = require("socket.io")(server);

const users = [];

io.on("connection", (socket) => {
  users.push(socket.id);
  console.log(`Logged [${users}]`);

  socket.on("disconnect", () => {
    const leaverIndex = users.findIndex((user) => user === socket.id);

    users.splice(leaverIndex, 1);

    console.log(`Logged [${users}]`);
  });
});

setInterval(() => {
  let randomX = 1200 - Math.random() * 200;
  let randomY = 600 - Math.random() * 100;

  io.emit("newPlataform", { x: randomX, y: randomY });
}, 2500);

app.use(express.static("../game/dist"));
server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
