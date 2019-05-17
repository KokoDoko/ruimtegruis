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
        this.bgtile = this.add.tileSprite(0, 0, 1440, 900, 'bg').setOrigin(0, 0)

        let w = Number(this.game.config.width)

        let t1 : Phaser.GameObjects.Text = this.add.text(w/2, -100, 'GAME OVER', { fontFamily: '"Press Start 2P"', fontSize: 70, color: '#FFF' }).setOrigin(0.5)
        let t2 : Phaser.GameObjects.Text = this.add.text(w/2, -100, 'Score: ' + this.registry.values.score, { fontFamily: '"Press Start 2P"', fontSize: 28, color: '#FFF' }).setOrigin(0.5)
        let t3 : Phaser.GameObjects.Text = this.add.text(w/2, 520, 'PRESS FIRE TO PLAY AGAIN ', { fontFamily: '"Press Start 2P"', fontSize: 22, color: '#ff3434' }).setOrigin(0.5)

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
            scaleX: 1.2,
            scaleY: 1.2,
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
