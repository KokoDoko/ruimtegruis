export class BootScene extends Phaser.Scene {

    private graphics        : Phaser.GameObjects.Graphics
    private progressbar     : Phaser.Geom.Rectangle
    private bFontsLoaded    : boolean = false
    private bAssetsLoaded   : boolean = false

    constructor() {
        super({key: "BootScene"})
    }

    init(): void {
        this.progressbar = new Phaser.Geom.Rectangle(200, 500, 0, 20)

        this.load.on('progress', (value) => {
            this.progressbar.width = 400 * value
        })

        this.load.on('complete', () => {
            this.bAssetsLoaded = true
        })
    }

    preload(): void {
        this.load.image('loading',      require("../assets/loading.png"))
        this.load.image('demo',         require("../assets/ruimtegruis.png"))
        this.load.image('title',        require("../assets/gruis_title.png"))
        this.load.image('ship',         require("../assets/ship.png"))
        this.load.image('bomb',         require("../assets/bomb.png"))
        this.load.image('rock',         require('../assets/block3.png'))
        this.load.image('bg',           require('../assets/background.png'))
        this.load.image('enemy',        require('../assets/enemy_red.png'))
        this.load.image('bullet',       require('../assets/bullet_grey.png'))
        this.load.image('explosion',    require('../assets/explosion.png'))
        this.load.image('pixel',        require('../assets/pixel.png'))
        this.load.script('webfont',     'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js')
    }

    create(): void {
        this.loadFonts()
        this.add.image(0, 0, 'loading').setOrigin(0, 0)
        this.graphics = this.add.graphics({ lineStyle: { width: 2, color: 0xFFFFFF }, fillStyle: { color: 0xCCCCCC } })
    }

    // http://labs.phaser.io/edit.html?src=src\game%20objects\text\static\google%20webfont.js
    // fonts with digits in the name need extra quotes // edit webfont.d.ts to fix ide warnings
    private loadFonts(){
        WebFont.load({
            google: {
                families: ['Press Start 2P']
            },
            active: () => this.fontsLoaded()
        })
    }

    update(){
        this.graphics.clear()
        this.graphics.fillRectShape(this.progressbar)
        this.graphics.strokeRectShape(new Phaser.Geom.Rectangle(200, 500, 400, 20))

        // als alles geladen
        if(this.bAssetsLoaded && this.bFontsLoaded) {
            this.scene.start('StartScene')
        }
    }

    // google fonts have been loaded
    private fontsLoaded(){
        this.add.text(400, 300, 'RUIMTEGRUIS', { fontFamily: '"Press Start 2P"', fontSize: 40, color: '#FFF' }).setOrigin(0.5)
        this.add.text(400, 340, 'LOADING', { fontFamily: '"Press Start 2P"', fontSize: 20, color: '#ff3434' }).setOrigin(0.5)
        this.bFontsLoaded = true
    }
}
