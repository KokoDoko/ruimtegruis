import { Joystick } from "../utils/arcade/input/joystick";
import { Bullet }   from "./bullet";
import { UI }       from "./ui";
import { Player }   from "../player";
import { GameScene } from "../scenes/game-scene";

export class Ship extends Phaser.Physics.Arcade.Sprite {

<<<<<<< HEAD
    private cursors: Phaser.Types.Input.Keyboard.CursorKeys
    private gameScene : GameScene
    private arcade : Arcade
=======
    

    // Fields
    private life        : number = 300
    private cursors     : Phaser.Input.Keyboard.CursorKeys
    private joystick    : Joystick
>>>>>>> b63560b88ecc3b4c49562fe4d80fe0402ca4736d
    private fireListener: EventListener
    private bombListener: EventListener
    public bulletGroup  : Phaser.GameObjects.Group
    private ui          : UI
    private player      : Player
    private fireKey     : Phaser.Input.Keyboard.Key

    // Statics
    public static COLORS : number[] = [0xFF0000, 0x00FF00]

    private static bombs        : number = 2
    public static get Bombs()   : number        { return Ship.bombs }
    public static set Bombs(v:number)           { this.bombs = v    }
    public static DecreaseBomb() : void         { if(this.bombs >= 1) this.bombs--  }
    public static IncreaseBomb() : void         { if(this.bombs < 5)  this.bombs++  }
    public static HasBombs()     : boolean      { return this.bombs > 0             }

    // Properties
    public get Score()          : number        { return this.player.Score          }
    public set Score(score      : number)       { this.player.Score = score         }

    public get Life()           : number        { return this.life                  }
    public set Life(life : number) { 
        this.life = life      
        this.ui.LifeBar = this.life
    }
    public get Color()          : number        {  return this.player.Color         }

    constructor(scene : Phaser.Scene, joystick : Joystick, player : Player) {
        super(scene, 180, 300 + player.Number * 50, "ship")   
        
        this.joystick       = joystick
        this.player         = player
        this.bulletGroup    = this.scene.add.group({ runChildUpdate: true })
        
        this.addParticles()
        this.setScale(0.55)
        this.scene.add.existing(this)
        this.addPhysics()
        
        this.cursors        = this.scene.input.keyboard.createCursorKeys()
        // this.scene.input.keyboard.addKeys({ 'fire': Phaser.Input.Keyboard.KeyCodes.CTRL})
        // this.scene.input.keyboard.addKeys({ 'bomb': Phaser.Input.Keyboard.KeyCodes.SPACE})
        
        // joystick fire button
        this.fireListener = () => this.shoot()
        this.bombListener = () => this.handleBombButton()
        // all buttonEvents (like "joystick0button0" for the first button) 
        // are stored in the array ButtonEvents
        if(this.joystick) {
            document.addEventListener(this.joystick.ButtonEvents[0], this.fireListener) 
            document.addEventListener(this.joystick.ButtonEvents[1], this.bombListener)
        }

        this.fireKey = this.scene.input.keyboard.addKey('CTRL')
        this.scene.input.keyboard.on('keydown_SPACE', this.fireListener)
        // this.scene.input.keyboard.on('CTRL'         , this.bombListener)
        

        this.ui = new UI(this.scene, this, this.player.Number ? true : false)
        this.tint = this.player.Color
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
        if(this.joystick) this.joystickInput()
        this.keyboardInput()

        // als gameover
        if (this.Life <= 0) {
            this.gameOver()
        }

        this.ui.update()
    }

    private gameOver(){
        if(this.joystick) {
            document.removeEventListener(this.joystick.ButtonEvents[0], this.fireListener)
            document.removeEventListener(this.joystick.ButtonEvents[1], this.bombListener)
        }
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
        this.setVelocityX(this.joystick.X * 400)
        this.setVelocityY(this.joystick.Y * 400)
    }

    private shoot() : void {
        this.bulletGroup.add(new Bullet(this.scene, this.x+20, this.y, this), true)
    }

    private handleBombButton():void {
        if(Ship.HasBombs()) {
            Ship.DecreaseBomb();
            (this.scene as GameScene).dropBomb() 
        }
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

        if(this.scene.input.keyboard.checkDown(this.fireKey, 500)) {
            this.handleBombButton()
        }
        // shoot continuously
        //if(this.cursors.space.isDown) {
        //    console.log("pew pew")
        //}

        // cooldown 500 msecs before firing again!
        // if(this.scene.input.keyboard.checkDown(this.cursors.space, 500)){
        //     this.shoot()
        //     // this.gameScene.friendlyBullet()
        //     console.log("hier?")
        // }

        // if(this.scene.input.keyboard.checkDown(
        //     this.scene.input.keyboard.keys[Phaser.Input.Keyboard.KeyCodes.CTRL ], 500)){
        //     this.shoot()
        //     // this.gameScene.friendlyBullet()
        // }
    }
}
