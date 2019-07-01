import { RuimteGruis }  from "../game"
import { Arcade }       from "../utils/arcade/arcade";

export class StartScene extends Phaser.Scene {

    private bgtile  : Phaser.GameObjects.TileSprite
    private cursors : Phaser.Input.Keyboard.CursorKeys
    private arcade  : Arcade
    private start   : Phaser.GameObjects.Text
    private nextGameListener: EventListener


    constructor() {
        super({key: "StartScene"})
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

        // mouse click on the whole scene
        this.input.once('pointerdown', (pointer) => this.nextGame())

        // joystick fire button
        this.nextGameListener = () => this.nextGame()
        document.addEventListener("joystick0button0", this.nextGameListener)
        document.addEventListener("joystick1button0", this.nextGameListener)
    }

    private showText(){
        let w = Number(this.game.config.width)
        let hiscore = Number(localStorage.getItem('hiscore'))

        this.add.text(w - 10, 30, 'Hiscore: ' + hiscore, { fontFamily: '"Press Start 2P"', fontSize: 18, color: '#FFF' }).setOrigin(1, 0.5)
        
        let title: Phaser.GameObjects.Image = this.add.image(500, 100, 'title')
        this.start = this.add.text(w / 2, 410, 'PRESS FIRE TO START', { fontFamily: '"Press Start 2P"', fontSize: 34, color: 'rgb(221,48,212)' }).setOrigin(0.5)
        
        this.add.text(w / 2, 520, 'Shoot enemy ships or bounce rocks into them!', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)
        this.add.text(w / 2, 560, 'Button 1 : Missile    Button 2 : Bomb', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)

        this.tweens.add({
            targets: title,
            y: 230,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay:100
        });

        this.tweens.add({
            targets: this.start,
            scaleX: 1.05,
            scaleY: 1.05,
            ease: 'Cubic.easeInOut',
            duration: 650,
            yoyo: true,
            repeat: -1
        })
        
    }

    public update(): void {
        this.bgtile.tilePositionX += 4

        for (let joystick of this.arcade.Joysticks) {
            joystick.update()
        }

        // spacebar start
        if (this.cursors.space.isDown) {
            this.nextGame()
        }

        // console.log(this.arcade.Joysticks)
        //console.log("joystick values " + this.arcade.Joysticks[0].X + " " + this.arcade.Joysticks[0].Y)
        
        
    }

    private selectMode() {
        this.children.remove(this.start)
        //TODO remove tween of start?
        
        let w = Number(this.game.config.width)
        let player1 = this.add.text(w / 2 - 100, 450, '1 PLAYER', { fontFamily: '"Press Start 2P"', fontSize: 20, color: 'rgb(221,48,212)' }).setOrigin(0.5)
        let player2 = this.add.text(w / 2 + 100, 450, '2 PLAYER', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)

        let player1Tween = this.tweens.add({
            targets: player1,
            scaleX: 1.05,
            scaleY: 1.05,
            ease: 'Cubic.easeInOut',
            duration: 650,
            yoyo: true,
            repeat: -1
        });
        player1.setColor("#FFF")
        player1Tween.stop()
    }

    private nextGame() {
        document.removeEventListener("joystick0button0", this.nextGameListener)
        document.removeEventListener("joystick1button0", this.nextGameListener)

        // this.registry.set("score", 0)
        // this.registry.set("bombs", 3)
        // this.registry.set("life", 300)

        this.scene.start('ModeScene')
    }
}
