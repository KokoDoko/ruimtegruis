import { Ship } from "./ship";

// why not extends Phaser.Scene ?
export class UI {

    private scene       : Phaser.Scene
    private ship        : Ship
    private graphics    : Phaser.GameObjects.Graphics
    private scoreField  : Phaser.GameObjects.Text
    private lifebar     : Phaser.Geom.Rectangle
    private bombtile    : Phaser.GameObjects.TileSprite
    private xPos        : number = 0
    private bombs       : Phaser.GameObjects.Image[] = []

    public set LifeBar(value : number) {
        this.lifebar.width = value
        this.update()
    }

    constructor(scene: Phaser.Scene, ship : Ship, rightPlayer : boolean = false) {
        this.scene  = scene
        this.ship   = ship
        let w       = Number(this.scene.game.config.width)

        // positioning
        this.xPos = rightPlayer ? w - 300 : 20

        this.graphics = this.scene.add.graphics({ 
            lineStyle: { width: 1, color: 0xFFFFFF }, 
            fillStyle: { color: this.ship.Color } 
        })
        this.lifebar = new Phaser.Geom.Rectangle(this.xPos, 60, 300, 16)
        this.graphics.fillRectShape(this.lifebar)
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(this.xPos, 60, 300, 16))
        
        this.scoreField = this.scene.add.text(this.xPos, 20, 
            'Score: ' + this.ship.Score, { fontFamily: '"Press Start 2P"', fontSize: 18, color: '#FFF' })
    
        // bomb tiles - todo gap in image
        if(!rightPlayer) {
            for (let i = 0; i < 5; i++) {
                let startpos = w/2 - 2.5 * 40 * 0.7
                let image = this.scene.add.image(startpos + i * 40, 20, 'bomb').setScale(0.7).setOrigin(0, 0)           
                this.bombs.push(image)
            }
            // this.bombtile = this.scene.add.tileSprite(w/2 - 2.5 * 36, 20, 5 * 40, 36, 'bomb').setScale(0.7).setOrigin(0, 0)
        }

        this.update()
   
        // listen to bomb events in game scene, then update amount of bombs
        // let gs = this.scene.scene.get("GameScene")
        // gs.events.on("bombsChanged", () => this.updateBombs())
    }

    // private updateBombs(){
    //     // repeating tile width keer aantal bombs
    //     let amount = this.scene.registry.values.bombs
    //     this.bombtile.width = 40 * amount
    // }

    public update() : void {
        this.scoreField.text = 'Score: ' + this.ship.Score
        // if (this.lifebar.width > this.ship.Life) this.lifebar.width--
        this.graphics.clear()
        this.graphics.fillRectShape(this.lifebar)
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(this.xPos, 60, 300, 16))

        this.bombs.forEach((bombImage,i) => {
            if(i <= Ship.Bombs - 1) bombImage.alpha = 1
            else bombImage.alpha = 0.4
        })
    }
}
