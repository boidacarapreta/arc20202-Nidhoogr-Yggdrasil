import Phaser from "phaser";

import { socket } from "../../drivers";

import {
  highClouds,
  lowClouds,
  montainTips,
  skyBackground,
  //----
} from "../../assets";

class Lobby extends Phaser.Scene {
  constructor() {
    super({ key: "Lobby" });
    this.players = {};
  }

  preload() {
    this.loadBackground();
  }

  create() {
    this.createBackground();
    this.createTexts();
  }

  update() {
    this.socketListener();
    this.parallaxEffect();
  }

  //Custom methods
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
          socket.emit("startGame");
          this.scene.start("Multiplayer");
        },
        this
      );

    this.add
      .text(0, 0, `Players logged`, {
        fill: "535353",
        font: "900 15px Courier",
        resolution: 5,
      })

      .setOrigin(0, 0);

    this.playerOneText = this.add
      .text(0, 15, `Player One: ${this.players.first ? "ON" : "OFF"}`, {
        fill: "535353",
        font: "900 10px Courier",
        resolution: 5,
      })

      .setOrigin(0, 0)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          console.log(`Player one ${this.players.first}`);
        },
        this
      );

    this.playerTwoText = this.add
      .text(0, 30, `Player Two: ${this.players.second ? "ON" : "OFF"}`, {
        fill: "535353",
        font: "900 10px Courier",
        resolution: 5,
      })
      .setOrigin(0, 0)
      .setInteractive()
      .on(
        "pointerdown",
        () => {
          console.log(`Player two ${this.players.second}`);
        },
        this
      );
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

  socketListener() {
    var ice_servers = {
      iceServers: [{ url: "stun:stun.l.google.com:19302" }],
    };
    var localConnection;
    var remoteConnection;
    var midias;
    const audio = document.querySelector("audio");

    socket.emit("getPlayers");

    socket.on("playerJoined", (playerList) => {
      console.log(`Playerlist by 'playerJoined': ${playerList}`);

      this.players = playerList;

      this.playerOneText.setText(
        `Player One: ${this.players.first ? "ON" : "OFF"}`
      );
      this.playerTwoText.setText(
        `Player Two: ${this.players.second ? "ON" : "OFF"}`
      );

      //------------------------
      // WebRTC ----------------
      if (playerList.first === socket.id) {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            midias = stream;
          })
          .catch((error) => console.log(error));
      } else if (playerList.second === socket.id) {
        navigator.mediaDevices
          .getUserMedia({ video: false, audio: true })
          .then((stream) => {
            midias = stream;
            localConnection = new RTCPeerConnection(ice_servers);
            midias
              .getTracks()
              .forEach((track) => localConnection.addTrack(track, midias));
            localConnection.onicecandidate = ({ candidate }) => {
              candidate &&
                socket.emit("candidate", jogadores.primeiro, candidate);
            };
            console.log(midias);
            localConnection.ontrack = ({ streams: [midias] }) => {
              audio.srcObject = midias;
            };
            localConnection
              .createOffer()
              .then((offer) => localConnection.setLocalDescription(offer))
              .then(() => {
                socket.emit(
                  "offer",
                  jogadores.primeiro,
                  localConnection.localDescription
                );
              });
          })
          .catch((error) => console.log(error));
      }
    });
    //------------------------

    socket.on("players", (playerList) => {
      this.players = playerList;

      this.playerOneText.setText(
        `Player One: ${this.players.first ? "ON" : "OFF"}`
      );
      this.playerTwoText.setText(
        `Player Two: ${this.players.second ? "ON" : "OFF"}`
      );
    });
  }
}

export default Lobby;
