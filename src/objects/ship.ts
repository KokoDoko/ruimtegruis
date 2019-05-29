import { GameScene } from "../scenes/game-scene"
import { Arcade } from "../utils/arcade"
import { RuimteGruis } from "../game"

export class Ship extends Phaser.Physics.Arcade.Sprite {

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private gameScene : GameScene
    private arcade : Arcade
    private fireListener: EventListener
    private bombListener: EventListener

    constructor(scene: GameScene) {
        super(scene, 180,350, "ship")    
        this.gameScene = scene
        
        this.addParticles()
        this.setScale(0.55)
        this.scene.add.existing(this)
        this.addPhysics()
        
        let g = this.scene.game as RuimteGruis
        this.arcade = g.arcade
        this.cursors = this.scene.input.keyboard.createCursorKeys()

        // joystick fire button
        this.fireListener = () => this.handleFireButton()
        this.bombListener = () => this.handleBombButton()
        document.addEventListener("joystick0button0", this.fireListener)
        document.addEventListener("joystick0button1", this.bombListener)
    }

    private addPhysics(){
        this.scene.physics.add.existing(this);
        this.setSize(this.displayWidth, this.displayHeight) 
        this.setCollideWorldBounds(true)
    }

    public update(): void {
        // slow down
        this.body.velocity.scale(0.99)
        // input
        this.joystickInput()
        this.keyboardInput()

        // als gameover
        if (this.scene.registry.values.life <= 0) {
            this.gameOver()
        }
    }

    private gameOver(){
        document.removeEventListener("joystick0button0", this.fireListener)
        document.removeEventListener("joystick0button1", this.bombListener)
        this.scene.scene.start('GameOver')
    }

    
    private addParticles() {
        let sparks = this.scene.add.particles('pixel')

        let emitter = sparks.createEmitter({
            speed: -100,
            gravityX: -300, 
            accelerationX: -100,
            x:-28,
            lifespan: 1000,
            tint:0xddbf37,
            scale: { start: 1, end: 0 },
            blendMode: 0 // add multiply screen erase
        });

        emitter.startFollow(this);
    }

    private joystickInput():void {
        for (let joystick of this.arcade.Joysticks) {
            joystick.update()
        }
        if (this.arcade.Joysticks[0]) {
            this.setVelocityX(this.arcade.Joysticks[0].X * 400)
            this.setVelocityY(this.arcade.Joysticks[0].Y * 400)
        }
    }

    private handleFireButton():void {
        this.gameScene.friendlyBullet()
    }

    private handleBombButton():void {
        this.gameScene.dropBomb()
    }

    private keyboardInput(): void {
        // todo normalise diagonals

        // move left right
        if (this.cursors.left.isDown) {
            this.setVelocityX(-350)
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(350)
        }

        // move down up
        if (this.cursors.up.isDown) {
            this.setVelocityY(-350)
        } else if (this.cursors.down.isDown) {
            this.setVelocityY(350)
        }

        // shoot continuously
        //if(this.cursors.space.isDown) {
        //    console.log("pew pew")
        //}

        // cooldown 500 msecs before firing again!
        if(this.scene.input.keyboard.checkDown(this.cursors.space, 500)){
            this.gameScene.friendlyBullet()
        }
    }
}
