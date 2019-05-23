export class Bomb extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene) {
        super(scene, 1100, Phaser.Math.Between(50, 580), "bomb")       

        this.setScale(0.8) 

        this.scene.physics.add.existing(this) 
        this.setSize(this.displayWidth + 20, this.displayHeight + 20)  // bug? te klein of te groot

        this.setVelocity(Phaser.Math.Between(-300, -100), Phaser.Math.Between(-40, 40))
        this.setAngularVelocity(Math.random() * 100)
    }

    // bomb verwijderen als uit beeld
    public update() : void {
        if (this.x < -300 || this.x > 1400 || this.y < -300 || this.y > 700){
            this.destroy()
        }
    }
}
