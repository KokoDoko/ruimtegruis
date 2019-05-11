import { GameScene } from "../scenes/game-scene"

export class Enemy extends Phaser.Physics.Arcade.Sprite {

    public score: number = 25
    private gameScene : GameScene
    private bulletTimer : number = Math.floor(Math.random() * 80)

    constructor(scene: GameScene) {
        super(scene, Phaser.Math.Between(550, 1150), Phaser.Math.Between(50, 550), "enemy")       

        this.gameScene = scene
        
        this.setScale(0.7)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setSize(this.displayWidth, this.displayHeight)
        this.setVelocity(Phaser.Math.Between(-200, -140),0)
    }

    public resetPosition() {
        this.x = 1300
        this.y = Phaser.Math.Between(50, 620)
        this.setVelocity(Phaser.Math.Between(-200, -140), 0)
    }

    // TODO RETURN FIRE!
    public update() : void {
       this.y += Math.sin(this.x / 50) * 3
       
       if (this.x < 0 - this.width){
            this.resetPosition()
       }

        // shoot every x seconds
        this.bulletTimer++
        if(this.bulletTimer % 60 == 0){
            this.gameScene.hostileBullet(this.body.x, this.body.y)
        }
    }
}
