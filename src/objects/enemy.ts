export class Enemy extends Phaser.Physics.Arcade.Sprite {

    public score: number = 25

    constructor(scene: Phaser.Scene) {
        super(scene, Phaser.Math.Between(550, 1150), Phaser.Math.Between(50, 550), "enemy")       
        
        this.setScale(0.7)
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setSize(this.displayWidth, this.displayHeight)
        this.setVelocity(Phaser.Math.Between(-200, -140),0)
    }

    public resetPosition() {
        this.y = Phaser.Math.Between(50, 550)
        this.x = 1000
        this.setVelocity(Phaser.Math.Between(-200, -140), 0)
    }

    public update() : void {
       if (this.x < 0 - this.width){
            this.resetPosition()
       }
    }
}
