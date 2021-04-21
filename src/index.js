import Phaser from "phaser";

import scenes from "./scenes";

const config = {
  type: Phaser.AUTO,
  autoCenter: Phaser.Scale.CENTER_BOTH,
  parent: "phaser-example",
  physics: {
    default: "arcade",
  },
  width: 800,
  height: 600,
  scene: scenes,
  antialias: false,
};

const game = new Phaser.Game(config);
