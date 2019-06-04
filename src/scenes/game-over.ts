import { RuimteGruis }  from "../game"
import { Player }       from "../player";
import { Ship } from "../objects/ship";

export class GameOver extends Phaser.Scene {

    private bgtile: Phaser.GameObjects.TileSprite
    private cursors: Phaser.Input.Keyboard.CursorKeys
    private nextGameListener: EventListener

    constructor() {
        super({key: "GameOver"})
    }

    init(): void {
    }
    
    preload(): void {
    }
    
    create(): void {
        let g = this.game as RuimteGruis
        // this.arcade = g.arcade
        this.cursors = this.input.keyboard.createCursorKeys()
        
        this.bgtile = this.add.tileSprite(0, 0, 1000, 625, 'bg').setOrigin(0, 0)

        let w       = Number(this.game.config.width)
        let hiscore = this.checkHighScore()

        this.add.text(w - 10, 30, 'Hiscore: ' + hiscore, { fontFamily: '"Press Start 2P"', fontSize: 18, color: '#FFF' }).setOrigin(1, 0.5)

        // Player results
        let position    = this.registry.values.mode ? w / 2 - 200 : w / 2
        let game        = this.game as RuimteGruis
        let playerResults : Phaser.GameObjects.Text[] = []
        let highscoreText : Phaser.GameObjects.Text

        for (const player of game.Players) {
            // convert dec (0xFF0000) to hex
            let color : string = "#"+player.Color.toString(16).padStart(6, "0")
            playerResults.push(
                this.add.text(position + player.Number * 400, -100, 
                    'Score: ' + player.Score, 
                    { fontFamily: '"Press Start 2P"', fontSize: 28, color:  color }).setOrigin(0.5)
            )
            if(player.Score === hiscore) {
                console.log("HIGHSCORE")
                highscoreText = this.add.text(position + player.Number * 400, -100, 
                    'A NEW HISCORE!', 
                    { fontFamily: '"Press Start 2P"', fontSize: 28, color:  "#FFF" }).setOrigin(0.5)
            }
        }

        let title: Phaser.GameObjects.Image = this.add.image(500, 100, 'title').setScale(0.5)

        let t1 : Phaser.GameObjects.Text = this.add.text(w/2, -100, 'GAME OVER', { fontFamily: '"Press Start 2P"', fontSize: 70, color: '#FFF' }).setOrigin(0.5)
        let t3: Phaser.GameObjects.Text = this.add.text(w / 2, 520, 'PRESS FIRE TO PLAY AGAIN ', { fontFamily: '"Press Start 2P"', fontSize: 22, color: 'rgb(221,48,212)' }).setOrigin(0.5)

        this.tweens.add({
            targets: t1,
            y: 230,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay: 100
        })

        this.tweens.add({
            targets: playerResults,
            y: 320,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay: 400
        })
        this.tweens.add({
            targets: highscoreText,
            y: 380,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay: 100
        })
        this.tweens.add({
            targets: t3,
            alpha: 0.8,
            scaleX: 1.05,
            scaleY: 1.05,
            ease: 'Cubic.easeInOut',
            duration: 650,
            yoyo:true,
            repeat:-1
        })

        // mouse click
        this.input.once('pointerdown', () => this.nextGame())

        // joystick fire button
        this.nextGameListener = () => this.nextGame()
        document.addEventListener("joystick0button0", this.nextGameListener)
    }
    

    public update(): void {
        this.bgtile.tilePositionX += 4

        // for (let joystick of this.arcade.Joysticks) {
        //     joystick.update()
        // }

        if (this.cursors.space.isDown) {
            this.nextGame()
        }
    }

    private nextGame(){
        document.removeEventListener("joystick0button0", this.nextGameListener)

        let game = this.game as RuimteGruis
        game.Players.forEach(p => p.Score = 0)
        Ship.Bombs = 2
        
        this.scene.start('GameScene')
    }

    private checkHighScore() : number {
        let highscore = Number(localStorage.getItem('hiscore'))
        let game = this.game as RuimteGruis
        let highestScore = 0

        game.Players.forEach(p => {
            if(p.Score > highestScore) highestScore = p.Score
        })

        if(highestScore > highscore) {
            localStorage.setItem('hiscore', String(highestScore))
            return highestScore
        } else {
            return highscore
        }
    }
}
