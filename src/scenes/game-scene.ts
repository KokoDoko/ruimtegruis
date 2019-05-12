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
    private enemyBulletGroup: Phaser.GameObjects.Group
    private enemyGroup: Phaser.GameObjects.Group
    private counter:integer = 0

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
        this.bgtile = this.add.tileSprite(0, 0, 1200, 675, 'bg').setOrigin(0,0)
        
        this.ship = new Ship(this)

        // group heeft auto update+add to scene, en auto remove+destroy, en group collision
        this.bulletGroup = this.add.group({ runChildUpdate: true }) 
        this.enemyBulletGroup = this.add.group({ runChildUpdate: true }) 
        this.rockGroup = this.add.group({ runChildUpdate: true })
        this.enemyGroup = this.add.group({ runChildUpdate: true })
        
        for (let i = 0; i < 8; i++) {
            this.rockGroup.add(new Rock(this), true)
        }

        this.enemyGroup.add(new Enemy(this), true)

        // collisions between player and rocks just causes bouncing
        this.physics.add.collider(this.ship, this.rockGroup)
        this.physics.add.collider(this.ship, this.enemyGroup, this.hitEnemy, null, this)
        
        // overlap for bullets (overlap ignores physics), why not put rocks and enemies in the same group?
        this.physics.add.overlap(this.bulletGroup, this.rockGroup, this.shootTarget, null, this)
        this.physics.add.overlap(this.bulletGroup, this.enemyGroup, this.shootTarget, null, this)
        this.physics.add.overlap(this.enemyGroup, this.rockGroup, this.hitRock, null, this)

        // enemy bullets can hit player
        this.physics.add.overlap(this.ship, this.enemyBulletGroup, this.shootPlayer, null, this)

        this.ui = new UI(this)
    }

    // an enemy is hit by a bouncing rock!
    private hitRock(e:Enemy, r: Rock) {
        // score
        this.registry.values.score += e.score

        // boom
        this.explosion(e.x, e.y)

        // reset rock and enemy
        e.resetPosition()
        r.resetPosition()
    }

    private hitEnemy(s:Ship, e:Enemy){
        this.explosion(e.x, e.y)
        
        e.resetPosition()

        this.registry.values.life = this.registry.values.life - 25
    }

    // add bullet to friendly group. collide friendly bullet group with rock group / with enemy ships (not in group)
    public friendlyBullet(){
        this.bulletGroup.add(new Bullet(this, this.ship.x+20, this.ship.y), true)
    }

    public hostileBullet(x:number, y:number) {
        this.enemyBulletGroup.add(new Bullet(this, x, y, true), true)
    }

    private shootPlayer(s : Ship, b : Bullet) {
        this.explosion(b.x, b.y)
        this.enemyBulletGroup.remove(b, true, true)
        this.registry.values.life = this.registry.values.life - 25
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
        this.bgtile.tilePositionX += 4

        this.ship.update()
        // this.debugField.text = 'Bullets: ' + this.bulletGroup.getChildren().length

        this.ui.update()

        // more rocks and enemies
        this.counter++
        if (this.counter % 420 == 0) {
            this.rockGroup.add(new Rock(this), true)
            this.enemyGroup.add(new Enemy(this), true)
        }
    }
}