export class GameOver extends Phaser.Scene {

    private bgtile: Phaser.GameObjects.TileSprite

    constructor() {
        super({key: "GameOver"})
    }

    init(): void {
    }
    
    preload(): void {
    }
    
    create(): void {
        this.bgtile = this.add.tileSprite(0, 0, 1200, 675, 'bg').setOrigin(0, 0)

        let w = Number(this.game.config.width)

        this.add.text(w/2, 180, 'GAME OVER', { fontFamily: '"Press Start 2P"', fontSize: 50, color: '#FFF' }).setOrigin(0.5)
        this.add.text(w/2, 240, 'Score: ' + this.registry.values.score, { fontFamily: '"Press Start 2P"', fontSize: 26, color: '#FFF' }).setOrigin(0.5)
        let go: Phaser.GameObjects.Text = this.add.text(w/2, 420, 'CLICK TO PLAY AGAIN ', { fontFamily: '"Press Start 2P"', fontSize: 22, color: '#ff3434' }).setOrigin(0.5)

        this.tweens.add({
            targets: go,
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
    }
}
