// Import Phaser modules
import Phaser from "phaser";
import io from "socket.io-client";

// Create scene
class LobbyScene extends Phaser.Scene {
  constructor() {
    super({
      // Assigning a key to the the scene
      key: "LobbyScene",
    });
  }

  // Preload assets
  preload() {}

  // Creating all that will be used in the scene
  create() {
    console.log("LobbyScene loaded");

    const playerOneFeedback = this.add
      .text(640, 250, "Player 1: waiting... ", {
        font: "30pt Arial",
      })
      .setOrigin(0.5, 0.5);

    const playerTwoFeedback = this.add
      .text(640, 350, "Player 2: waiting... ", {
        font: "30pt Arial",
      })
      .setOrigin(0.5, 0.5);

    this.socket = io();

    this.socket.on("players", (players) => {
      console.log(players);

      players.first && playerOneFeedback.setText("Player 1: OK");

      players.second && playerTwoFeedback.setText("Player 2: OK");
    });

    this.add
      .text(640, 460, "Go back", {
        font: "30pt Arial",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on(
        "pointerdown",
        () => {
          this.scene.start("ModeSelectionScene");
        },
        this
      );
  }
}

export default LobbyScene;
