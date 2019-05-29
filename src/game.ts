import "phaser";
import { BootScene } from "./scenes/boot-scene";
import { StartScene } from "./scenes/start-scene";
import { GameScene } from "./scenes/game-scene";
import { GameOver } from "./scenes/game-over";
import { Arcade } from "./utils/arcade"

const config: Phaser.Types.Core.GameConfig = {
    width: 1000,
    height: 625,
    scale: {
        mode: Phaser.Scale.ScaleModes.FIT,
        autoCenter: Phaser.Scale.Center.CENTER_BOTH
    },
    parent: "game",
    resolution: window.devicePixelRatio, // added
    // @ts-ignore Issue with Typescript definitions in Phaser 3.17.0
    scene: [BootScene, StartScene, GameScene, GameOver],
    input: {
        keyboard: true
    },
    physics: {
        default: "arcade",
        arcade: {
            debug: false, // shows velocity and hitboxes! 
            gravity: { y: 0 }
        }
    },
    render: { pixelArt: true }
};

export class RuimteGruis extends Phaser.Game {

    public arcade:Arcade

    constructor(config: Phaser.Types.Core.GameConfig) {
        super(config)

        // create the arcade once, otherwise we keep connecting/disconnecting every scene
        this.arcade = new Arcade()
    }
}

window.addEventListener("load", () => new RuimteGruis(config))
