export class UI {

    private scene:Phaser.Scene
    private graphics: Phaser.GameObjects.Graphics
    private scoreField: Phaser.GameObjects.Text
    private lifebar: Phaser.Geom.Rectangle

    constructor(scene: Phaser.Scene) {
        this.scene = scene

        this.graphics = this.scene.add.graphics({ lineStyle: { width: 2, color: 0xFFFFFF }, fillStyle: { color: 0x00AA00 } })
        this.lifebar = new Phaser.Geom.Rectangle(20, 20, 300, 20)
        this.graphics.fillRectShape(this.lifebar)
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(20, 20, 300, 20))
        
        let w = Number(this.scene.game.config.width)
        this.scoreField = this.scene.add.text(w - 240, 20, 'Score: ' + this.scene.registry.values.score, { fontFamily: '"Press Start 2P"', fontSize: 24, color: '#FFF' })
    }

    public update() : void {
        this.scoreField.text = 'Score: ' + this.scene.registry.values.score
        if (this.lifebar.width > this.scene.registry.values.life) this.lifebar.width--
        this.graphics.clear()
        this.graphics.fillRectShape(this.lifebar)
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(20, 20, 300, 20))

        if (this.lifebar.width < 0) {
            this.scene.scene.start('GameOver')
        }
    }
}
