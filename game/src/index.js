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

const ice_servers = {
  iceServers: [{ url: "stun:stun.l.google.com:19302" }],
};
const localConnection;
const remoteConnection;
const midias;
const audio = document.querySelector("audio");

const game = new Phaser.Game(config);

export { localConnection, remoteConnection, midias, audio };
