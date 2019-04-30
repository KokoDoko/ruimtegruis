import {GameScene} from "../scenes/game-scene"

// TODO DON'T IMPORT GAMESCENE
// INSTEAD EMIT FIRE EVENT WHEN PRESSING SPACE
// GAMESCENE LISTENS FOR FIRE EVENTS

export class Ship extends Phaser.Physics.Arcade.Sprite {

    private cursors: Phaser.Input.Keyboard.CursorKeys
    private gameScene : GameScene

    constructor(scene: GameScene) {
        super(scene, 100,450, "ship")    
        this.gameScene = scene
        this.addParticles()

        this.setScale(0.7)
        this.scene.add.existing(this)
        this.addPhysics()

        this.cursors = this.scene.input.keyboard.createCursorKeys()

        
    }

    
    
    private addPhysics(){
        this.scene.physics.add.existing(this);
        this.setSize(this.displayWidth, this.displayHeight) 
        this.setCollideWorldBounds(true)
    }

    public update(): void {
        this.handleInput();
    }

    
    private addParticles() {
        let particles = this.scene.add.particles('pixel')

        let emitter = particles.createEmitter({
            speed: -100,
            gravityX: -300, 
            accelerationX: -100,
            x:-40,
            tint:0xddbf37,
            maxParticles: 60,
            scale: { start: 1, end: 0 },
            blendMode: 0 // add multiply screen erase
        });

        emitter.startFollow(this);
    }

    private handleInput(): void {
        // slow down
        this.body.velocity.scale(0.95)

        // todo normalise diagonals

        // cursor
        if (this.cursors.left.isDown) {
            this.setVelocityX(-350)
        } else if (this.cursors.right.isDown) {
            this.setVelocityX(350)
        }

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
