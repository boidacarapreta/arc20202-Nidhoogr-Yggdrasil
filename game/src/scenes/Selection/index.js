import Phaser from "phaser";

import { socket } from "../../drivers";

import {
  redSky,
  redWood,
  woodDetails,
  forest,
  //----
  introMusic,
} from "../../assets";

class Selection extends Phaser.Scene {
  constructor() {
    super({ key: "Selection" });
  }

  preload() {
    this.loadBackground();
    this.loadMusic();
  }

  create() {
    this.createBackground();
    this.createTexts();
    this.playMusic();
  }

  update() {
    this.parallaxEffect();
  }

  //Custom methods
  createTexts() {
    this.add
      .text(400, 250, "Single Player", {
        fill: "535353",
        font: "900 35px Courier",
        resolution: 5,
      })
      .setInteractive()
      .setOrigin(0.5, 0.5)
      .on(
        "pointerdown",
        () => {
          this.scene.start("SinglePlayer");
        },
        this
      );

    this.add
      .text(400, 350, "Multiplayer", {
        fill: "535353",
        font: "900 35px Courier",
        resolution: 5,
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
      .text(0, 0, "Toggle Fullscreen", {
        fill: "535353",
        font: "900 20px Courier",
        resolution: 5,
      })
      .setInteractive()
      .on("pointerdown", () => {
        !this.scale.isFullscreen
          ? this.scale.startFullscreen()
          : this.scale.stopFullscreen();
      });
  }

  loadBackground() {
    this.load.image("redSky", redSky);
    this.load.image("redWood", redWood);
    this.load.image("woodDetails", woodDetails);
    this.load.image("forest", forest);
  }

  createBackground() {
    this.add.image(0, 0, "redSky").setOrigin(0, 0);

    this.redWood = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "redWood"
      )
      .setOrigin(0, 0);

    this.woodDetails = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "woodDetails"
      )
      .setOrigin(0, 0);

    this.forest = this.add
      .tileSprite(
        1,
        1,
        this.game.config.width,
        this.game.config.height,
        "forest"
      )
      .setOrigin(0, 0);
  }

  parallaxEffect() {
    // this.lowClouds.tilePositionX += 0.15;
    // this.montainTips.tilePositionX += 0.1;
    // this.highClouds.tilePositionX += 0.2;

    this.forest.tilePositionX += 0.2;
    this.redWood.tilePositionX += 0.1;
    this.woodDetails.tilePositionX += 0.15;
  }

  loadMusic() {
    this.load.audio("introMusic", introMusic);
  }

  playMusic() {
    this.introMusic = this.sound.add("introMusic", {
      volume: 0.2,
      loop: true,
    });
  }
}

export default Selection;
