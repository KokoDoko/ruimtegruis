export class GameOver extends Phaser.Scene {

    private bgtile: Phaser.GameObjects.TileSprite
    private cursors: Phaser.Input.Keyboard.CursorKeys

    constructor() {
        super({key: "GameOver"})
    }

    init(): void {
    }
    
    preload(): void {
    }
    
    create(): void {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.bgtile = this.add.tileSprite(0, 0, 1000, 625, 'bg').setOrigin(0, 0)

        let w = Number(this.game.config.width)
        let hiscore = Number(localStorage.getItem('hiscore'))
        let scoreText = 'Score: ' + this.registry.values.score

        if (this.registry.values.score > hiscore) {
            localStorage.setItem('hiscore', String(this.registry.values.score))
            scoreText += " -- A NEW HISCORE!"
        }

        let title: Phaser.GameObjects.Image = this.add.image(500, 100, 'title').setScale(0.5)

        let t1 : Phaser.GameObjects.Text = this.add.text(w/2, -100, 'GAME OVER', { fontFamily: '"Press Start 2P"', fontSize: 70, color: '#FFF' }).setOrigin(0.5)
        let t2 : Phaser.GameObjects.Text = this.add.text(w/2, -100, scoreText, { fontFamily: '"Press Start 2P"', fontSize: 28, color: '#FFF' }).setOrigin(0.5)
        let t3: Phaser.GameObjects.Text = this.add.text(w / 2, 520, 'PRESS FIRE TO PLAY AGAIN ', { fontFamily: '"Press Start 2P"', fontSize: 22, color: 'rgb(221,48,212)' }).setOrigin(0.5)

        this.tweens.add({
            targets: t1,
            y: 220,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay: 100
        })

        this.tweens.add({
            targets: t2,
            y: 320,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay: 400
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

        this.input.once('pointerdown', () => {
            this.scene.start('GameScene')
        })
    }

    public update(): void {
        this.bgtile.tilePositionX += 4

        if (this.cursors.space.isDown) {
            this.scene.start('GameScene')
        }
    }
}
