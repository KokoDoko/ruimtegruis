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
        this.bgtile = this.add.tileSprite(0, 0, 1440, 900, 'bg').setOrigin(0, 0)
        // this.add.image(200, 300, 'ship').setOrigin(0, 0)

        this.showText()

        //click on the whole scene
        this.input.once('pointerdown', (pointer) => {
             this.scene.start('GameScene')
        })
    }

    private showText(){
        let w = Number(this.game.config.width)
        
        let title: Phaser.GameObjects.Text = this.add.text(w/2, -100, 'RUIMTEGRUIS', { fontFamily: '"Press Start 2P"', fontSize: 76, color: '#FFF' }).setOrigin(0.5)
        let start: Phaser.GameObjects.Text = this.add.text(w/2, 380, 'PRESS FIRE TO START', { fontFamily: '"Press Start 2P"', fontSize: 34, color: '#ff3434' }).setOrigin(0.5)
        
        this.add.text(w / 2, 520, 'Shoot enemey ships or bounce rocks into them!', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)
        this.add.text(w / 2, 560, 'Use gamepad or cursor keys', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#FFF' }).setOrigin(0.5)

        this.tweens.add({
            targets: title,
            y: 220,
            duration: 1600,
            ease: 'Back',
            easeParams: [3.5],
            delay:100
        });

        this.tweens.add({
            targets: start,
            scaleX: 1.2,
            scaleY: 1.2,
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
