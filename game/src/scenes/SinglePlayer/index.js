import Phaser from "phaser";

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
  //----
  introMusic,
} from "../../assets";

class SinglePlayer extends Phaser.Scene {
  constructor() {
    super({ key: "SinglePlayer" });
  }

  preload() {
    this.loadBackground();
    this.loadPlayersSprites();
    this.loadPlataform();
    this.loadJumpSounds();
    this.loadMusic();
  }

  create() {
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
    this.playMusic();
  }

  update() {
    this.parallaxEffect();
    this.animationSelector();

    this.centralizePlayers();

    this.death();
  }

  //Custom methods
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

  loadPlayersSprites() {
    this.load.spritesheet("DudeJump", DudeJump, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("DudeRun", DudeRun, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("OwletJump", OwletJump, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("OwletRun", OwletRun, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("PinkJump", PinkJump, {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet("PinkRun", PinkRun, {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  animatePlayerSprites() {
    this.anims.create({
      key: "DudeJumpAnimation",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("DudeJump", {
        start: 1,
        end: 8,
      }),
    });

    this.anims.create({
      key: "DudeRunAnimation",
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("DudeRun", {
        start: 1,
        end: 6,
      }),
    });

    this.anims.create({
      key: "OwletJumpAnimation",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("OwletJump", {
        start: 1,
        end: 8,
      }),
    });

    this.anims.create({
      key: "OwletRunAnimation",
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("OwletRun", {
        start: 1,
        end: 6,
      }),
    });

    this.anims.create({
      key: "PinkJumpAnimation",
      frameRate: 8,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("PinkJump", {
        start: 1,
        end: 8,
      }),
    });

    this.anims.create({
      key: "PinkRunAnimation",
      frameRate: 15,
      repeat: -1,
      frames: this.anims.generateFrameNumbers("PinkRun", {
        start: 1,
        end: 6,
      }),
    });
  }

  createPlayers() {
    this.DudeMonster = this.physics.add
      .sprite(300, 200, "DudeRun")
      .setScale(2)
      .setGravityY(600)
      .setBounce(0.05);

    this.OwletMonster = this.physics.add
      .sprite(400, 200, "OwletRun")
      .setScale(2)
      .setGravityY(600)
      .setBounce(0.05);

    this.PinkMonster = this.physics.add
      .sprite(500, 200, "PinkRun")
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
  }

  // TODO Remove after tests
  playAnimations() {
    this.OwletMonster.anims.play("OwletRunAnimation", true);
    this.PinkMonster.anims.play("PinkRunAnimation", true);
  }

  loadPlataform() {
    this.load.image("plataform", plataform);
  }

  createPlataform() {
    this.plataformOne = this.physics.add
      .sprite(400, 500, "plataform")
      .setScale(2)
      .setVelocityX(-200)
      .setImmovable(true)
      .setOffset(0, 12);

    this.plataformTwo = this.physics.add
      .sprite(700, 550, "plataform")
      .setScale(2)
      .setVelocityX(-200)
      .setImmovable(true)
      .setOffset(0, 12);

    this.plataformThree = this.physics.add
      .sprite(1100, 500, "plataform")
      .setScale(2)
      .setVelocityX(-200)
      .setImmovable(true)
      .setOffset(0, 12);

    this.plataformGroup = this.add.group();

    this.plataformGroup.add(this.plataformOne);
    this.plataformGroup.add(this.plataformTwo);
    this.plataformGroup.add(this.plataformThree);

    this.time.addEvent({
      delay: 2500,
      loop: true,
      callbackScope: this,
      callback: () => {
        let randomY = 600 - Math.random() * 100;
        let randomX = 1200 - Math.random() * 200;

        const newPlataform = this.physics.add
          .sprite(randomX, randomY, "plataform")
          .setScale(2)
          .setVelocityX(-200)
          .setImmovable(true)
          .setOffset(0, 12);

        this.plataformGroup.add(newPlataform);
      },
    });
  }

  addColiders() {
    this.physics.add.collider(this.plataformGroup, this.playersGroup);
  }

  gameControl() {
    this.input.on("pointerdown", this.jump, this);
  }

  jump() {
    if (this.DudeMonster.body.touching.down) {
      this.DudeMonster.setVelocityY(8000);
      this.selectRandomJumpSound().play();
    }
  }

  animationSelector() {
    if (this.DudeMonster.body.touching.down) {
      this.DudeMonster.anims.play("DudeRunAnimation", true);
    } else {
      this.DudeMonster.anims.play("DudeJumpAnimation", true);
    }
  }

  loadJumpSounds() {
    this.load.audio("jumpSoundVariantOne", jumpSoundVariantOne);
    this.load.audio("jumpSoundVariantTwo", jumpSoundVariantTwo);
    this.load.audio("jumpSoundVariantThree", jumpSoundVariantThree);
  }

  createJumpSounds() {
    this.jumpSoundVariantOne = this.sound.add("jumpSoundVariantOne", {
      volume: 0.3,
    });
    this.jumpSoundVariantTwo = this.sound.add("jumpSoundVariantTwo", {
      volume: 0.3,
    });
    this.jumpSoundVariantThree = this.sound.add("jumpSoundVariantThree", {
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
    if (this.DudeMonster.y > this.game.config.height) {
      this.introMusic.stop();
      this.scene.start("GameOver");
    }
  }

  loadMusic() {
    this.load.audio("introMusic", introMusic);
  }

  playMusic() {
    this.introMusic = this.sound.add("introMusic", {
      volume: 0.1,
      loop: true,
    });

    this.introMusic.play();
  }
}

export default SinglePlayer;
