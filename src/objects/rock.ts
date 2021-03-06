export class Rock extends Phaser.Physics.Arcade.Sprite {

    public score:number = 5

    constructor(scene: Phaser.Scene) {
        super(scene, Phaser.Math.Between(1050, 1300), Phaser.Math.Between(50, 580), "rock")       

        this.setScale(0.3 + Math.random() * 0.5) 

        this.scene.physics.add.existing(this) 
        this.setSize(this.displayWidth + 20, this.displayHeight + 20)  // bug? te klein of te groot
        this.setBounce(2,2)
        this.resetVelocity()
    }

    public resetPosition() {
        this.x = 1100
        this.y = Phaser.Math.Between(40, 580)
        this.resetVelocity()
    }

    private resetVelocity(){
        this.setVelocity(Phaser.Math.Between(-300, -100), Phaser.Math.Between(-40, 40))
        this.setAngularVelocity(Math.random() * 100)
    }

    // rock kan aan alle kanten uit beeld vliegen
    public update() : void {
        if (this.x < -300 || this.x > 1400 || this.y < -300 || this.y > 700){
            this.resetPosition()
        }
    }
}
