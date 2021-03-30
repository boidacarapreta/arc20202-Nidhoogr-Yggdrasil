// -------------------------
// Importing phaser module
import Phaser from "phaser";
// -------------------------

// -------------------------
// Importing scenes
import TitleScene from "./scenes/TitleScene";
import ModeSelectionScene from "./scenes/ModeSelectionScene";
import GameScene from "./scenes/GameScene";
import EndGameScene from "./scenes/EndGameScene";
// -------------------------

// -------------------------
// Setting game config
const config = {
  type: Phaser.AUTO,

  antialias: false,

  parent: "phaser-example",

  // 1280x640 || 40x20(32x32)
  width: 1280,
  height: 640,
  autoCenter: Phaser.Scale.CENTER_BOTH,

  physics: {
    default: "arcade",
  },

  scene: [TitleScene, ModeSelectionScene, GameScene, EndGameScene],
};
// -------------------------

// if ("serviceWorker" in navigator) {
//   navigator.serviceWorker
//     .register("sw.js")
//     .then((reg) => console.info("Service worker registered: ", reg))
//     .catch((err) => console.error("Error registering service worker: ", err));
// }

// -------------------------
// Starting the game
const game = new Phaser.Game(config);
// -------------------------
