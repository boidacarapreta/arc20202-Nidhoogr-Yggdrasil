const express = require("express");

const app = express();
const server = require("http").Server(app);

const PORT = 1506;

const io = require("socket.io")(server);

let players = {
  first: false,
  second: false,
};

io.on("connection", (socket) => {
  players.first ? (players.second = socket.id) : (players.first = socket.id);

  io.emit("players", players);
  console.log(`Player list: ${players.first}, ${players.second}`);

  socket.on("disconnect", () => {
    switch (socket.id) {
      case players.first:
        return (players.first = false);

      case players.second:
        return (players.second = false);

      default:
        return;
    }
  });
});

app.use(express.static("./dist"));
server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
