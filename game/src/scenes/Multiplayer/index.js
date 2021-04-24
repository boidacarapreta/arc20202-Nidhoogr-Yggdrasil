import Phaser from "phaser";

import { socket } from "../../drivers";

import {
  highClouds,
  lowClouds,
  montainTips,
  skyBackground,
  //----
  DudeJump,
  DudeRun,
  //----
  OwletJump,
  OwletRun,
  //----
  PinkJump,
  PinkRun,
  //----
  plataform,
  //----
  jumpSoundVariantOne,
  jumpSoundVariantTwo,
  jumpSoundVariantThree,
} from "../../assets";

class Multiplayer extends Phaser.Scene {
  constructor() {
    super({ key: "Multiplayer" });
    this.players = false;
    this.localPlayer = false;
    this.anotherPlayer = false;
  }

  preload() {
    this.loadBackground();
    this.loadPlayersSprites();
    this.loadPlataform();
    this.loadJumpSounds();
  }

  create() {
    this.socketListener();

    this.createBackground();
    this.createPlayers();
    this.createJumpSounds();
    this.createScore();

    this.createPlataform();
    this.removeUnseenPlataforms();

    this.addColiders();

    this.gameControl();
    this.incrementScore();

    this.animatePlayerSprites();
    this.playAnimations();
  }

  update() {
    this.parallaxEffect();
    this.animationSelector();

    this.centralizePlayers();

    this.death();
  }

  //Custom methods
  loadBackground() {
    this.load.image("highCloudsMP", highClouds);
    this.load.image("lowCloudsMP", lowClouds);
    this.load.image("montainTipsMP", montainTips);
    this.load.image("skyBackgroundMP", skyBackground);
  }

  createBackground() {
    this.add.image(0, 0, "skyBackgroundMP").setOrigin(0, 0);

    this.lowClouds = this.add
      .tileSprite(
        1,
        1,
        this.game.config.width,
        this.game.config.height,
        "lowCloudsMP"
      )
      .setOrigin(0, 0);

    this.montainTips = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "montainTipsMP"
      )
      .setOrigin(0, 0);

    this.highClouds = this.add
      .tileSprite(
        0,
        0,
        this.game.config.width,
        this.game.config.height,
        "highCloudsMP"
      )
      .setOrigin(0, 0);
  }

  parallaxEffect() {
    this.lowClouds.tilePositionX += 0.15;
    this.montainTips.tilePositionX += 0.1;
    this.highClouds.tilePositionX += 0.2;
  }

  loadPlayersSprites() {
    this.load.spritesheet("DudeJumpMP", DudeJump, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("DudeRunMP", DudeRun, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("OwletJumpMP", OwletJump, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("OwletRunMP", OwletRun, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("PinkJumpMP", PinkJump, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("PinkRunMP", PinkRun, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  animatePlayerSprites() {
    this.anims.create({
      key: "DudeJumpAnimationMP",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("DudeJumpMP", {
        start: 1,
        end: 8,
      }),
    });

    this.anims.create({
      key: "DudeRunAnimationMP",
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("DudeRunMP", {
        start: 1,
        end: 6,
      }),
    });

    this.anims.create({
      key: "OwletJumpAnimationMP",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("OwletJumpMP", {
        start: 1,
        end: 8,
      }),
    });

    this.anims.create({
      key: "OwletRunAnimationMP",
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("OwletRunMP", {
        start: 1,
        end: 6,
      }),
    });

    this.anims.create({
      key: "PinkJumpAnimationMP",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("PinkJumpMP", {
        start: 1,
        end: 8,
      }),
    });

    this.anims.create({
      key: "PinkRunAnimationMP",
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("PinkRunMP", {
        start: 1,
        end: 6,
      }),
    });
  }

  createPlayers() {
    this.DudeMonster = this.physics.add
      .sprite(300, 200, "DudeRunMP")
      .setScale(2)
      .setGravityY(600)
      .setBounce(0.05);

    this.OwletMonster = this.physics.add
      .sprite(400, 200, "OwletRunMP")
      .setScale(2)
      .setGravityY(600)
      .setBounce(0.05);

    this.PinkMonster = this.physics.add
      .sprite(500, 200, "PinkRunMP")
      .setScale(2)
      .setGravityY(600)
      .setBounce(0.05);

    this.playersGroup = this.add.group();

    this.playersGroup.add(this.DudeMonster);
    this.playersGroup.add(this.OwletMonster);
    this.playersGroup.add(this.PinkMonster);
  }

  centralizePlayers() {
    this.DudeMonster.setX(300);
    this.OwletMonster.setX(280);
  }

  // TODO Remove after tests
  playAnimations() {
    this.OwletMonster.anims.play("OwletRunAnimationMP", true);
    this.PinkMonster.anims.play("PinkRunAnimationMP", true);
  }

  loadPlataform() {
    this.load.image("plataformMP", plataform);
  }

  createPlataform() {
    this.plataformOne = this.physics.add
      .sprite(400, 500, "plataformMP")
      .setScale(2)
      .setVelocityX(-200)
      .setImmovable(true)
      .setOffset(0, 12);

    this.plataformTwo = this.physics.add
      .sprite(700, 550, "plataformMP")
      .setScale(2)
      .setVelocityX(-200)
      .setImmovable(true)
      .setOffset(0, 12);

    this.plataformThree = this.physics.add
      .sprite(1100, 500, "plataformMP")
      .setScale(2)
      .setVelocityX(-200)
      .setImmovable(true)
      .setOffset(0, 12);

    this.plataformGroup = this.add.group();

    this.plataformGroup.add(this.plataformOne);
    this.plataformGroup.add(this.plataformTwo);
    this.plataformGroup.add(this.plataformThree);
  }

  addColiders() {
    this.physics.add.collider(this.plataformGroup, this.playersGroup);
  }

  gameControl() {
    this.input.on("pointerdown", this.jump, this);
  }

  jump() {
    if (this.localPlayer.sprite.body.touching.down) {
      socket.emit("anotherPlayerJumped");
      this.localPlayer.sprite.setVelocityY(8000);
      this.selectRandomJumpSound().play();
    }
  }

  animationSelector() {
    if (this.DudeMonster.body.touching.down) {
      this.DudeMonster.anims.play("DudeRunAnimationMP", true);
    } else {
      this.DudeMonster.anims.play("DudeJumpAnimationMP", true);
    }
  }

  loadJumpSounds() {
    this.load.audio("jumpSoundVariantOneMP", jumpSoundVariantOne);
    this.load.audio("jumpSoundVariantTwoMP", jumpSoundVariantTwo);
    this.load.audio("jumpSoundVariantThreeMP", jumpSoundVariantThree);
  }

  createJumpSounds() {
    this.jumpSoundVariantOne = this.sound.add("jumpSoundVariantOneMP", {
      volume: 0.3,
    });
    this.jumpSoundVariantTwo = this.sound.add("jumpSoundVariantTwoMP", {
      volume: 0.3,
    });
    this.jumpSoundVariantThree = this.sound.add("jumpSoundVariantThreeMP", {
      volume: 0.3,
    });
  }

  selectRandomJumpSound() {
    this.jumpSoundsArray = [
      this.jumpSoundVariantOne,
      this.jumpSoundVariantTwo,
      this.jumpSoundVariantThree,
    ];

    const randomIndex = Math.floor(Math.random() * 3);

    return this.jumpSoundsArray[randomIndex];
  }

  createScore() {
    this.score = 0;
    this.scoreText = this.add
      .text(0, 0, this.score, {
        fill: "535353",
        font: "900 35px Courier",
        resolution: 5,
      })
      .setOrigin(0, 0);
  }

  incrementScore() {
    this.time.addEvent({
      delay: 100,
      loop: true,
      callbackScope: this,
      callback: () => {
        this.scoreText.setText(this.score++);
      },
    });
  }

  removeUnseenPlataforms() {
    this.time.addEvent({
      delay: 2600,
      loop: true,
      callbackScope: this,
      callback: () => {
        const groupChildrenArray = this.plataformGroup.getChildren();

        const firstChildren = groupChildrenArray[0];

        this.plataformGroup.remove(firstChildren);

        firstChildren.destroy();
      },
    });
  }

  death() {
    this.localPlayer.y > this.game.config.height &&
      this.scene.start("GameOver");
  }

  anotherPlayerJump() {
    if (this.anotherPlayer) {
      if (this.anotherPlayer.sprite.body.touching.down) {
        this.anotherPlayer.sprite.setVelocityY(8000);
        this.selectRandomJumpSound().play();
      }
    }
  }

  socketListener() {
    socket.on("players", (playerList) => {
      this.players = playerList;

      if (playerList.first === socket.id) {
        this.localPlayer = {
          sprite: this.DudeMonster,
          id: socket.id,
        }; //"first";

        this.anotherPlayer = {
          sprite: this.OwletMonster,
          id: playerList.second,
        }; //"second";
      } else if (playerList.second === socket.id) {
        this.localPlayer = {
          sprite: this.OwletMonster,
          id: socket.id,
        }; //"second";

        this.anotherPlayer = {
          sprite: this.DudeMonster,
          id: playerList.second,
        }; //"first";
      }

      // console.log(`playerList ${this.players}`);
      // console.log(`localPlayer ${this.localPlayer}`);
      // console.log(`anotherPlayer ${this.anotherPlayer}`);
    });

    socket.on("anotherPlayerJump", this.anotherPlayerJump());

    socket.on("newPlataform", (coordinates) => {
      const newPlataform = this.physics.add
        .sprite(coordinates.x, coordinates.y, "plataformMP")
        .setScale(2)
        .setVelocityX(-200)
        .setImmovable(true)
        .setOffset(0, 12);

      this.plataformGroup.add(newPlataform);
    });
  }
}

export default Multiplayer;
