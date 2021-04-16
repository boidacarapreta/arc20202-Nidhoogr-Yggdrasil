const express = require("express");

const app = express();
const server = require("http").Server(app);

const PORT = 1506;

// const io = require("socket.io")(server);

// let players = {
//   first: false,
//   second: false,
// };

// io.on("connection", (socket) => {
//   players.first ? (players.second = socket.id) : (players.first = socket.id);

//   io.emit("players", players);
//   console.log("Player List: %s", players);

//   socket.on("disconnect", () => {
//     players.first ? (players.second = false) : (players.first = false);
//   });
// });

app.use(express.static("./dist"));
server.listen(PORT, () => console.log(`Server listening on port ${PORT}!`));
