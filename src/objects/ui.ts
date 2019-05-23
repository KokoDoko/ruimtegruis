// why not extends Phaser.Scene ?

export class UI {

    private scene:Phaser.Scene
    private graphics: Phaser.GameObjects.Graphics
    private scoreField: Phaser.GameObjects.Text
    private lifebar: Phaser.Geom.Rectangle
    // private bombs : Phaser.GameObjects.Image[]
    private bombtile: Phaser.GameObjects.TileSprite

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.graphics = this.scene.add.graphics({ lineStyle: { width: 1, color: 0xFFFFFF }, fillStyle: { color: 0x00AA00 } })
        this.lifebar = new Phaser.Geom.Rectangle(20, 20, 300, 16)
        this.graphics.fillRectShape(this.lifebar)
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(20, 20, 300, 16))
        
        let w = Number(this.scene.game.config.width)
        this.scoreField = this.scene.add.text(w - 10, 20, 'Level: ' + this.scene.registry.values.level +' Score: ' + this.scene.registry.values.score, { fontFamily: '"Press Start 2P"', fontSize: 18, color: '#FFF' }).setOrigin(1,0.5)
    
        // bomb tiles - todo gap in image
        this.bombtile = this.scene.add.tileSprite(20, 46, 120, 36, 'bomb').setScale(0.7).setOrigin(0, 0)
   
        // listen to bomb events in game scene, then update amount of bombs
        let gs = this.scene.scene.get("GameScene")
        gs.events.on("bombsChanged", () => this.updateBombs())
    }

    private updateBombs(){
        // repeating tile width keer aantal bombs
        let amount = this.scene.registry.values.bombs
        this.bombtile.width = 40 * amount
    }

    public update() : void {
        this.scoreField.text = 'Score: ' + this.scene.registry.values.score
        if (this.lifebar.width > this.scene.registry.values.life) this.lifebar.width--
        this.graphics.clear()
        this.graphics.fillRectShape(this.lifebar)
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(20, 20, 300, 16))

        
    }
}
