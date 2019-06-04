import { RuimteGruis }  from "../game"
import { Arcade }       from "../utils/arcade/arcade";
import { Player }       from "../player";

export class ModeScene extends Phaser.Scene {

    private bgtile  : Phaser.GameObjects.TileSprite
    private cursors : Phaser.Input.Keyboard.CursorKeys
    private arcade  : Arcade
    
    private mode : Mode = Mode.Single
    
    private player1Text : Phaser.GameObjects.Text
    private player2Text : Phaser.GameObjects.Text
    private player1Tween: Phaser.Tweens.Tween
    private player2Tween: Phaser.Tweens.Tween
    
    private nextGameListener: EventListener

    constructor() {
        super({key: "ModeScene"})
    }

    init(): void {
    }

    preload(): void {
    }

    create(): void {
        let g = this.game as RuimteGruis
        this.arcade = g.Arcade

        this.cursors = this.input.keyboard.createCursorKeys()
        this.bgtile = this.add.tileSprite(0, 0, 1000, 625, 'bg').setOrigin(0, 0)

        this.showText()

        // joystick fire button
        this.nextGameListener = () => this.nextGame()
        document.addEventListener("joystick0button0", this.nextGameListener)
        document.addEventListener("joystick1button0", this.nextGameListener)
    }

    private showText(){
        let w = Number(this.game.config.width)
        let hiscore = Number(localStorage.getItem('hiscore'))

        this.add.text(w - 10, 30, 'Hiscore: ' + hiscore, { fontFamily: '"Press Start 2P"', fontSize: 18, color: '#FFF' }).setOrigin(1, 0.5)
        
        let title: Phaser.GameObjects.Image = this.add.image(500, 230, 'title')

        this.player1Text = this.add.text(w / 2 - 100, 450, '1 PLAYER', { fontFamily: '"Press Start 2P"', fontSize: 20, color: 'rgb(221,48,212)' }).setOrigin(0.5)
        this.player2Text = this.add.text(w / 2 + 100, 450, '2 PLAYER', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)
        
        this.add.text(w / 2, 520, 'Shoot enemy ships or bounce rocks into them!', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)
        this.add.text(w / 2, 560, 'Button 1 : Missile    Button 2 : Bomb', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)

        this.player1Tween = this.tweens.add({
            targets: this.player1Text,
            scaleX: 1.05,
            scaleY: 1.05,
            ease: 'Cubic.easeInOut',
            duration: 650,
            yoyo: true,
            repeat: -1
        })
        this.player2Tween = this.tweens.add({
            targets: this.player2Text,
            scaleX: 1.05,
            scaleY: 1.05,
            ease: 'Cubic.easeInOut',
            duration: 650,
            yoyo: true,
            repeat: -1
        })
        this.player2Tween.pause()
    }

    public update(): void {
        this.bgtile.tilePositionX += 4

        for (let joystick of this.arcade.Joysticks) {
            joystick.update()
            if      (joystick.Left)     this.switchPlayerMode(1)
            else if (joystick.Right)    this.switchPlayerMode(2)
        }

        // spacebar start
        if (this.cursors.space.isDown) {
            this.nextGame()
        }

        // Select single player or two player game
        if (this.cursors.left.isDown) {
            this.switchPlayerMode(1)
        }
        else if (this.cursors.right.isDown) {
            this.switchPlayerMode(2)
        }        
    }
   
    private  switchPlayerMode(players: number) {
        
        switch(players) {
            case 1:
                this.player1Text.setColor('rgb(221,48,212)')
                this.player2Text.setColor('#FFF')
                
                this.player1Tween.resume()
                this.player2Tween.pause()
                // switch setting / config / mode number of players
                this.mode = Mode.Single
                break;
            case 2: 
                this.player1Text.setColor('#FFF')
                this.player2Text.setColor('rgb(221,48,212)')
                
                this.player1Tween.pause()
                this.player2Tween.resume()
                this.mode = Mode.TwoPlayer
                break;
        }
        
    }

    private nextGame() {
        document.removeEventListener("joystick0button0", this.nextGameListener)
        document.removeEventListener("joystick1button0", this.nextGameListener)

        this.registry.set("mode", this.mode)
        // this.registry.set("bombs", 3)
        // this.registry.set("life", 300)
        for (let i = 0; i <= this.mode; i++) {
            let player = new Player(i);
            (this.game as RuimteGruis).Player = player
        }
        
        this.scene.start('GameScene')
    }
}

export enum Mode {
    Single      = 0,
    TwoPlayer   = 1 
}
