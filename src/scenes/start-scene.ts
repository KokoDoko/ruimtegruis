export class StartScene extends Phaser.Scene {

    private bgtile: Phaser.GameObjects.TileSprite
    private cursors: Phaser.Input.Keyboard.CursorKeys

    constructor() {
        super({key: "StartScene"})
    }

    init(): void {
    }

    preload(): void {
    }

    create(): void {
        this.cursors = this.input.keyboard.createCursorKeys()
        this.bgtile = this.add.tileSprite(0, 0, 1000, 625, 'bg').setOrigin(0, 0)

        

        this.showText()

        //click on the whole scene
        this.input.once('pointerdown', (pointer) => {
             this.scene.start('GameScene')
        })
    }

    private showText(){
        let w = Number(this.game.config.width)
        let hiscore = Number(localStorage.getItem('hiscore'))

        this.add.text(w / 2, 30, 'Hiscore: ' + hiscore, { fontFamily: '"Press Start 2P"', fontSize: 18, color: '#FFF' }).setOrigin(0.5)
        
        let title: Phaser.GameObjects.Image = this.add.image(500, 100, 'title')
        let start: Phaser.GameObjects.Text = this.add.text(w / 2, 410, 'PRESS FIRE TO START', { fontFamily: '"Press Start 2P"', fontSize: 34, color: 'rgb(221,48,212)' }).setOrigin(0.5)
        
        this.add.text(w / 2, 520, 'Shoot enemy ships or bounce rocks into them!', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)
        this.add.text(w / 2, 560, 'Use gamepad or cursor keys', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)

        this.tweens.add({
            targets: title,
            y: 230,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay:100
        });

        this.tweens.add({
            targets: start,
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

        if (this.cursors.space.isDown) {
            this.scene.start('GameScene')
        }
    }
}
