import { Enemy } from "../objects/enemy"
import { Ship } from "../objects/ship"
import { Rock } from "../objects/rock"
import { Bullet } from "../objects/bullet"
import { UI } from "../objects/ui"

export class GameScene extends Phaser.Scene {
    
    private ship : Ship
    private ui:UI
    private bgtile: Phaser.GameObjects.TileSprite
    private rockGroup : Phaser.GameObjects.Group
    private bulletGroup: Phaser.GameObjects.Group
    private enemyGroup: Phaser.GameObjects.Group
    private counter:integer = 0

    // todo
    // enemy bullets

    // debug
    // private debugField : Phaser.GameObjects.Text
    
    constructor() {
        super({key: "GameScene"})
    }

    init(): void {
        this.registry.set("score", 0)
        this.registry.set("life", 250)
    }

    create(): void {
        this.bgtile = this.add.tileSprite(0, 0, 800, 600, 'bg')
        this.bgtile.setOrigin(0,0)
        
        this.ship = new Ship(this)

        // group heeft auto update+add to scene, en auto remove+destroy, en group collision
        this.bulletGroup = this.add.group({ runChildUpdate: true }) 
        this.rockGroup = this.add.group({ runChildUpdate: true })
        this.enemyGroup = this.add.group({ runChildUpdate: true })
        
        for (let i = 0; i < 14; i++) {
            this.rockGroup.add(new Rock(this), true)
        }

        for (let i = 0; i < 3; i++) {
            this.enemyGroup.add(new Enemy(this), true)
        }

        // collisions 
        this.physics.add.collider(this.ship, this.rockGroup, this.hitRock, null, this)
        this.physics.add.collider(this.ship, this.enemyGroup, this.hitEnemy, null, this)

        // overlap for bullets (overlap ignores physics), why not put rocks and enemies in the same group?
        this.physics.add.overlap(this.bulletGroup, this.rockGroup, this.shootTarget, null, this)
        this.physics.add.overlap(this.bulletGroup, this.enemyGroup, this.shootTarget, null, this)

        this.ui = new UI(this)

        // this.debugField = this.add.text(20, 550, "Bullets: 0", { fontFamily: '"Press Start 2P"', fontSize: 18, color: '#FFF' })
    }

    private hitRock(s: Ship, r: Rock) {
        this.registry.values.life = this.registry.values.life - 10
    }

    private hitEnemy(s:Ship, e:Enemy){
        this.explosion(e.x, e.y)
        
        e.resetPosition()

        this.registry.values.life = this.registry.values.life - 25
    }

    // add bullet to friendly group. collide friendly bullet group with rock group / with enemy ships (not in group)
    public friendlyBullet(){
        this.bulletGroup.add(new Bullet(this, this.ship.x+10, this.ship.y), true)
    }

    private shootTarget(b: Bullet, t: Rock | Enemy) {
        // score
        this.registry.values.score += t.score

        // boom
        this.explosion(t.x, t.y)
         
        // remove bullet from group, remove from scene, destroy child
        this.bulletGroup.remove(b, true, true)

        // reset rock or enemy
        t.resetPosition()

        // the more you shoot the more rocks appear
        this.counter++
        if(this.counter % 4 == 0) {
             this.rockGroup.add(new Rock(this), true)
        }
    }

    private explosion(x: number, y: number) {
        // explosion on this position
        let explosion = this.add.image(x, y, 'explosion').setScale(0.2)
        this.tweens.add({
            targets: explosion,
            alpha: 0,
            scaleX: 1.4,
            scaleY: 1.4,
            ease: 'Cubic.easeOut',
            duration: 650,
            onComplete: function (tween: Phaser.Tweens.Tween, targets: Phaser.GameObjects.Image[]) {
                targets[0].destroy()
            }
        })
    }

    public update(): void {
        this.bgtile.tilePositionX += 3

        this.ship.update()
        // this.debugField.text = 'Bullets: ' + this.bulletGroup.getChildren().length

        this.ui.update()
    }
}