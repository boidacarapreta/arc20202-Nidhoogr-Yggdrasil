import Phaser from "phaser";

import { socket } from "../../drivers";

class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
  }

  preload() {}

  create() {
    this.createTexts();
  }

  update() {}

  //Custom methods
  createTexts() {
    this.add
      .text(400, 250, "Play", {
        font: "30pt Arial",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on(
        "pointerdown",
        () => {
          this.scene.start("Multiplayer");
        },
        this
      );

    this.add
      .text(400, 350, "Go back", {
        font: "30pt Arial",
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on(
        "pointerdown",
        () => {
          this.scene.start("Selection");
        },
        this
      );
  }
}

export default Lobby;