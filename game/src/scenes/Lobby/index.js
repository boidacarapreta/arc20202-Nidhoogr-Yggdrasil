import Phaser from "phaser";

import { socket } from "../../drivers";

class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
  }

  preload() {}

  create() {
    this.multiplayerRoom = [];
    this.createTexts();
  }

  update() {
    this.socketListener();
  }

  //Custom methods
  createTexts() {
    this.playerOneText = this.add
      .text(400, 200, `Player one: ...`, {
        font: "30pt Arial",
      })
      .setOrigin(0.5, 0.5);

    this.playerTwoText = this.add
      .text(400, 275, `Player two: ...`, {
        font: "30pt Arial",
      })
      .setOrigin(0.5, 0.5);

    this.playerThreeText = this.add
      .text(400, 350, `Player three: ...`, {
        font: "30pt Arial",
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(480, 450, "Play", {
        font: "20pt Arial",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on(
        "pointerdown",
        () => {
          if (this.multiplayerRoom.lenght > 1) {
            socket.emit("startedMultiplayer");
            this.scene.start("Multiplayer");
          } else {
            alert("Must be at least 2 players to play multiplayer");
          }
        },
        this
      );

    this.add
      .text(350, 450, "Go back", {
        fill: "535353",
        font: "900 35px Courier",
        resolution: 5,
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on(
        "pointerdown",
        () => {
          socket.emit("leaveLobby");
          this.scene.start("Selection");
        },
        this
      );
  }

  socketListener() {
    socket.on("playerJoinedRoom", (players) => {
      this.multiplayerRoom = players;

      this.playerOneText.setText(`Player one: ${players[0] ? "OK" : "..."}`);
      this.playerTwoText.setText(`Player two: ${players[1] ? "OK" : "..."}`);
      this.playerThreeText.setText(
        `Player three: ${players[2] ? "OK" : "..."}`
      );
    });
  }
}

export default Lobby;
