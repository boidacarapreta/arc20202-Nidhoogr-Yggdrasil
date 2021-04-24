const express = require("express");

const app = express();
const server = require("http").Server(app);

const PORT = 1506;

const io = require("socket.io")(server);

const users = [];

const players = { first: false, second: false };

io.on("connection", (socket) => {
  users.push(socket.id);
  console.log(`Logged [${users}]`);

  socket.on("joinLobby", () => {
    if (!players.first) {
      players.first = socket.id;
      io.emit("playerJoined", players);
    } else if (!players.second) {
      players.second = socket.id;
      io.emit("playerJoined", players);
    } else {
      socket.emit("roomFull");
    }
    console.log(`First player: ${players.first}`);
    console.log(`Second player: ${players.second}`);
  });

  socket.on("startGame", () => {
    io.emit("players", players);
  });

  socket.on("died", () => {
    removePlayer(socket);
  });

  //------------------------
  // WebRTC ----------------

  // Sinalização de áudio: oferta
  socket.on("offer", (socketId, description) => {
    socket.to(socketId).emit("offer", socket.id, description);
  });

  // Sinalização de áudio: atendimento da oferta
  socket.on("answer", (socketId, description) => {
    socket.to(socketId).emit("answer", description);
  });

  // Sinalização de áudio: envio dos candidatos de caminho
  socket.on("candidate", (socketId, signal) => {
    socket.to(socketId).emit("candidate", signal);
  });

  //------------------------

  socket.on("disconnect", () => {
    removePlayer(socket);

    const leaverIndex = users.findIndex((user) => user === socket.id);

    users.splice(leaverIndex, 1);

    console.log(`Logged [${users}]`);
  });
});

const removePlayer = (player) => {
  if (player.id === players.first) {
    players.first = false;
  } else if (player.id === players.first) {
    players.second = false;
  }

  console.log(`First player: ${players.first}`);
  console.log(`Second player: ${players.second}`);
};

setInterval(() => {
  io.emit("players", players);
}, 2500);

setInterval(() => {
  let randomX = 1200 - Math.random() * 200;
  let randomY = 600 - Math.random() * 100;

  io.emit("newPlataform", { x: randomX, y: randomY });
}, 2500);

app.use(express.static("../game/dist"));
server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
