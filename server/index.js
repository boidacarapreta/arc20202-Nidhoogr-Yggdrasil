const express = require("express");

const app = express();
const server = require("http").Server(app);

const PORT = 1506;

const io = require("socket.io")(server);

const connectedUsers = [];

let multiplayerRoom = [];

io.on("connection", (socket) => {
  connectedUsers.push(socket.id);
  console.log(connectedUsers);

  socket.on("joinLobby", () => {
    if (multiplayerRoom.length <= 3) {
      multiplayerRoom.push(socket.id);
      joinLobby(socket);
    } else {
      socket.emit("roomIsFull");
    }
  });

  socket.on("leaveLobby", () => {
    leaveLobby(socket);
  });

  socket.on("disconnect", () => {
    leaveLobby();

    const leaverIndex = connectedUsers.findIndex((user) => user === socket.id);

    connectedUsers.splice(leaverIndex, 1);

    console.log(connectedUsers);
  });
});

const joinLobby = (socket) => {
  socket.emit("joinedLobby");

  setTimeout(() => {
    io.emit("playerJoinedRoom", multiplayerRoom);
  }, 500);
};

const leaveLobby = (socket) => {
  const multiplayerLeaverIndex = multiplayerRoom.findIndex(
    (user) => user === socket.id
  );

  multiplayerRoom.splice(multiplayerLeaverIndex, 1);
};
setInterval(() => {
  let randomX = 1200 - Math.random() * 200;
  let randomY = 600 - Math.random() * 100;

  io.emit("newPlataform", { x: randomX, y: randomY });
}, 2500);

app.use(express.static("../game/dist"));
server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
