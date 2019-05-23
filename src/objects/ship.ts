import { GameScene } from "../scenes/game-scene"
import { Joystick } from "../utils/joystick"

export class Ship extends Phaser.Physics.Arcade.Sprite {

    private cursors: Phaser.Input.Keyboard.CursorKeys
    private gameScene : GameScene
    private joystick : Joystick

    constructor(scene: GameScene) {
        super(scene, 180,350, "ship")    
        this.gameScene = scene
        
        this.addParticles()
        this.setScale(0.55)
        this.scene.add.existing(this)
        this.addPhysics()
        
        this.cursors = this.scene.input.keyboard.createCursorKeys()

        this.joystick = new Joystick(6)
        document.addEventListener("button0", () => this.handleFireButton())
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
        this.joystick.update()
        this.joystickInput()
        this.keyboardInput()
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
        this.setVelocityX(this.joystick.XAxis * 400)
        this.setVelocityY(this.joystick.YAxis * 400)
    }

    private handleFireButton():void {
        this.gameScene.friendlyBullet()
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
