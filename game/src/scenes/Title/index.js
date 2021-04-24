import Phaser from "phaser";

import {
  highClouds,
  lowClouds,
  montainTips,
  skyBackground,
} from "../../assets";

class Title extends Phaser.Scene {
  constructor() {
    super({ key: "Title" });
  }

  preload() {
    this.loadBackground();
  }

  create() {
    this.createBackground();
    this.createTexts();
  }

  update() {
    this.parallaxEffect();
  }

  // Custom methods
  createTexts() {
    this.add
      .text(400, 300, "Play", {
        fill: "535353",
        font: "900 35px Courier",
        resolution: 5,
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
    this.load.image("highClouds", highClouds);
    this.load.image("lowClouds", lowClouds);
    this.load.image("montainTips", montainTips);
    this.load.image("skyBackground", skyBackground);
  }

  createBackground() {
    this.add.image(0, 0, "skyBackground").setOrigin(0, 0);

    this.lowClouds = this.add
      .tileSprite(
        1,
        1,
        this.game.config.width,
        this.game.config.height,
        "lowClouds"
      )
      .setOrigin(0, 0);

    this.montainTips = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "montainTips"
      )
      .setOrigin(0, 0);

    this.highClouds = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "highClouds"
      )
      .setOrigin(0, 0);
  }

  parallaxEffect() {
    this.lowClouds.tilePositionX += 0.15;
    this.montainTips.tilePositionX += 0.1;
    this.highClouds.tilePositionX += 0.2;
  }
}

export default Title;
