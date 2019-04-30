export class GameOver extends Phaser.Scene {

    constructor() {
        super({key: "GameOver"})
    }

    init(): void {
    }
    
    preload(): void {
    }
    
    create(): void {
        this.add.image(0, 0, 'demo').setOrigin(0, 0)

        this.add.text(400, 150, 'GAME OVER', { fontFamily: '"Press Start 2P"', fontSize: 40, color: '#FFF' }).setOrigin(0.5)
        this.add.text(400, 200, 'Score: ' + this.registry.values.score, { fontFamily: '"Press Start 2P"', fontSize: 26, color: '#FFF' }).setOrigin(0.5)
        let go: Phaser.GameObjects.Text = this.add.text(400, 420, 'CLICK TO PLAY AGAIN ', { fontFamily: '"Press Start 2P"', fontSize: 22, color: '#ff3434' }).setOrigin(0.5)

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

    update(): void {
        
    }
}
