import "phaser";
import { BootScene } from "./scenes/boot-scene";
import { StartScene } from "./scenes/start-scene";
import { GameScene } from "./scenes/game-scene";
import { GameOver } from "./scenes/game-over";
import { Arcade } from "./utils/arcade"

const config: GameConfig = {
    width: 1000,
    height: 625,
    parent: "game",
    resolution: window.devicePixelRatio, // added
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

    constructor(config: GameConfig) {
        super(config)

        // create the arcade once, otherwise we keep connecting/disconnecting every scene
        this.arcade = new Arcade()

        window.addEventListener("resize", () => this.resizeGame())
        this.resizeGame()
    }

    public resizeGame(){
        // WE HAVE TO SCALE THE CANVAS
        // PHASER SCALE CONFIG DOCUMENTATION IS INCORRECT 
        // NOTE: als je zelf scaling uitrekent moet viewport meta-tag weg uit html!!
        
        let scale = Math.min(window.innerWidth/1000, window.innerHeight/625)
        let div : HTMLElement = document.querySelector("#game")! as HTMLElement;
        let canvas = div.querySelector("canvas")
        
        canvas.style.transform = `scale(${scale})`
        //div.style.transform = `scale(${scale})`
  }
}

window.addEventListener("load", () => new RuimteGruis(config))
