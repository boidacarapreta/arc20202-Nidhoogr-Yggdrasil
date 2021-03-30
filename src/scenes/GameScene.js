// -------------------------
// Import Phaser module
import Phaser from "phaser";
// -------------------------

// -------------------------
// Import all the exports on the file index.js on the
// assets folder as an object with directories location
import * as images from "../assets/images";
import * as audio from "../assets/audio";
// -------------------------

// -------------------------
// Create scene
class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.audio("backgroundMusic", audio.runGameMusic);

    this.load.audio("jumpSound1", audio.jumpSound1);
    this.load.audio("jumpSound2", audio.jumpSound2);
    this.load.audio("jumpSound3", audio.jumpSound3);

    this.load.image("ground", images.ground);
    this.load.image("layer0", images.layer0);
    this.load.image("layer1", images.layer1);
    this.load.image("layer2", images.layer2);
    this.load.image("layer3", images.layer3);
    this.load.image("layer4", images.layer4);

    this.load.spritesheet("playerRun", images.playerRun, {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("playerJump", images.playerJump, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    // Adding sound to the game
    this.backgroundMusic = this.sound.add("backgroundMusic", {
      volume: 0.2,
      loop: true,
    });

    this.jumpSound1 = this.sound.add("jumpSound1", {
      volume: 0.3,
    });

    this.jumpSound2 = this.sound.add("jumpSound2", {
      volume: 0.3,
    });

    this.jumpSound3 = this.sound.add("jumpSound3", {
      volume: 0.3,
    });

    this.jumpSound = [this.jumpSound1, this.jumpSound2, this.jumpSound3];

    this.backgroundMusic.play();

    // -------------------------
    // Background Layers (inert)

    // layer0
    this.add.image(0, 0, "layer0").setOrigin(0, 0);

    // layer2
    this.add.image(0, 0, "layer2").setOrigin(0, 0);

    //  Parallax - Start

    // Get the window sizes
    let windowWidth = window.innerWidth;
    let windowHeight = window.innerHeight;

    // Find the center of the top space
    let topBackgroundXOrigin = windowWidth / 2.5;
    let topBackgroundYOrigin = (windowHeight / 5) * 2;
    let topBackgroundHeight = (windowHeight / 5) * 5;

    // Base width and height of the images
    let imageBaseWidth = 1280;
    let imageBaseHeight = 640;
    let heightRatio = topBackgroundHeight / imageBaseHeight;

    // Add each layer one by one

    // layer1
    this.hslayer1 = this.add.tileSprite(
      topBackgroundXOrigin,
      topBackgroundYOrigin,
      imageBaseWidth,
      imageBaseHeight,
      "layer1"
    );
    this.hslayer1.setScale(heightRatio);

    // layer3
    this.hslayer3 = this.add.tileSprite(
      topBackgroundXOrigin,
      topBackgroundYOrigin,
      imageBaseWidth,
      imageBaseHeight,
      "layer3"
    );
    this.hslayer3.setScale(heightRatio);

    // layer4
    this.hslayer4 = this.add.tileSprite(
      topBackgroundXOrigin,
      topBackgroundYOrigin,
      imageBaseWidth,
      imageBaseHeight,
      "layer4"
    );
    this.hslayer4.setScale(heightRatio);
    //
    // Parallax - End
    //
    this.groundGroup = this.add.group({
      removeCallback: (ground) => {
        ground.scene.groundPool.add(ground);
      },
    });

    this.groundPool = this.add.group({
      removeCallback: (ground) => {
        ground.scene.groundGroup.add(ground);
      },
    });

    this.addGround(1280, 1280 / 2);

    this.player = this.physics.add
      .sprite(640, 360, "playerRun")
      .setScale(1)
      .setBounce(0.05)
      .setGravityY(600)
      .setVelocityX(100);

    this.physics.add.collider(this.player, this.groundGroup);

    this.input.on("pointerdown", this.jump, this);

    this.anims.create({
      key: "run",
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("playerRun", {
        start: 1,
        end: 8,
      }),
    });

    this.anims.create({
      key: "jump",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("playerJump", {
        start: 1,
        end: 8,
      }),
    });
  }

  jump() {
    if (this.player.body.touching.down) {
      const randomIndex = Math.floor(Math.random() * 3);

      this.jumpSound[randomIndex].play();
      this.player.setVelocityX(50);
      this.player.setVelocityY(5000000);
    }
  }

  addGround(groundWidth, posX) {
    let ground;

    if (this.groundPool.getLength()) {
      ground = this.groundPool.getFirst();

      ground.x = posX;

      ground.active = true;
      ground.visible = true;

      this.groundPool.remove(ground);
    } else {
      ground = this.physics.add.sprite(posX, 600, "ground");

      ground.setImmovable(true);
      ground.setVelocityX(-200);

      this.groundGroup.add(ground);
    }

    ground.displayWidth = groundWidth;

    this.nextGroundDistance = Phaser.Math.Between(100, 350);
  }

  update() {
    if (this.player.y > 720) {
      this.scene.start("EndGameScene");
      this.backgroundMusic.stop();
    }

    if (!this.player.body.touching.down) {
      this.player.anims.play("jump", true);
    } else {
      this.player.anims.play("run", true);
    }

    this.player.x = 640;

    let minDistance = 1280;

    this.groundGroup.getChildren().forEach((ground) => {
      let groundDistance = 1280 - ground.x - ground.displayWidth / 2;

      minDistance = Math.min(minDistance, groundDistance);

      if (ground.x < -ground.displayWidth / 2) {
        this.groundGroup.killAndHide(ground);
        this.groundGroup.remove(ground);
      }
    }, this);

    if (minDistance > this.nextGroundDistance) {
      let nextGroundWidth = Phaser.Math.Between(100, 350);

      this.addGround(nextGroundWidth, 1280 + nextGroundWidth / 2);
    }

    // Test Parallax
    this.hslayer1.tilePositionX += 0.15;
    this.hslayer3.tilePositionX += 0.1;
    this.hslayer4.tilePositionX += 0.2;
  }
}
// -------------------------

// -------------------------
// Export as default of the file the scene
export default GameScene;
// -------------------------

// *
// *
// *
