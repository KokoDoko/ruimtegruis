import { Enemy }        from "../objects/enemy"
import { Ship }         from "../objects/ship"
import { Rock }         from "../objects/rock"
import { Bullet }       from "../objects/bullet"
import { Bomb }         from "../objects/bomb"
import { RuimteGruis }  from "../game";

export class GameScene extends Phaser.Scene {
    
    private shipsGroup  : Phaser.GameObjects.Group
    private bgtile      : Phaser.GameObjects.TileSprite
    private rockGroup   : Phaser.GameObjects.Group
    private enemyBulletGroup: Phaser.GameObjects.Group
    private enemyGroup  : Phaser.GameObjects.Group
    private counter     : integer = 0
    
    constructor() {
        super({key: "GameScene"})
    }

    create(): void {
        this.bgtile = this.add.tileSprite(0, 0, 1000, 625, 'bg').setOrigin(0,0)
        
        // group heeft auto update+add to scene, en auto remove+destroy, en group collision
        // this.bulletGroup        = this.add.group({ runChildUpdate: true }) 
        this.enemyBulletGroup   = this.add.group({ runChildUpdate: true }) 
        this.rockGroup          = this.add.group({ runChildUpdate: true })
        this.enemyGroup         = this.add.group({ runChildUpdate: true })
        this.shipsGroup         = this.add.group({ runChildUpdate: true })
        
        let game = this.game as RuimteGruis
        for (let i = 0; i <= this.registry.values.mode; i++) {
            this.shipsGroup.add(new Ship(this, game.Arcade.Joysticks[i], game.Players[i]))
        }

        for (let i = 0; i < 8; i++) {
            this.rockGroup.add(new Rock(this), true)
        }

        this.enemyGroup.add(new Enemy(this), true)

        // collisions between player and rocks just causes bouncing
        this.physics.add.collider(this.shipsGroup, this.rockGroup)

        // kan ook overlap zijn?
        this.physics.add.collider(this.shipsGroup, this.enemyGroup, this.hitEnemy, null, this)
        
        // overlap for bullets (overlap ignores physics), why not put rocks and enemies in the same group?
        for (const ship of this.shipsGroup.getChildren() as Ship[]) {
            this.physics.add.overlap(ship.bulletGroup, this.rockGroup, this.shootTarget, null, this) 
            this.physics.add.overlap(ship.bulletGroup, this.enemyGroup, this.shootTarget, null, this)
        }
        // this.physics.add.overlap(this.bulletGroup, this.rockGroup, this.shootTarget, null, this)
        // this.physics.add.overlap(this.bulletGroup, this.enemyGroup, this.shootTarget, null, this)
        this.physics.add.overlap(this.enemyGroup, this.rockGroup, this.hitRock, null, this)

        // enemy bullets and powerups hit player - function decides what to do
        this.physics.add.overlap(this.shipsGroup, this.enemyBulletGroup, this.shootPlayer, null, this)

        // localStorage.setItem('hiscore', String(0))
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

        s.Life -= 30
    }

    public dropBomb(){
        for (let go of this.enemyGroup.getChildren()) {
            let enemy   = go as Enemy
            let game    = this.game as RuimteGruis

            for (const player of game.Players) {
                player.Score += enemy.score
            }
            this.explosion(enemy.x, enemy.y)
            enemy.resetPosition()
        }
    }

    public hostileBullet(x:number, y:number) {
        this.enemyBulletGroup.add(new Bullet(this, x, y, null, true), true)
    }

    private shootPlayer(s : Ship, target : Phaser.Physics.Arcade.Sprite) {
        if(target instanceof Bullet) {
            this.explosion(target.x, target.y)
            this.enemyBulletGroup.remove(target, true, true)
            s.Life -= 35 
        }
        if (target instanceof Bomb) {
            this.enemyBulletGroup.remove(target, true, true)
            Ship.IncreaseBomb()
            // this.events.emit("bombsChanged") // for the UI
        }
    }

    private shootTarget(bullet: Bullet, target: Rock | Enemy) {
        // score
        // this.registry.values.score += target.score
        bullet.ship.Score += target.score

        // boom
        this.explosion(target.x, target.y)
         
        // remove bullet from group, remove from scene, destroy child
        bullet.remove()
        
        // reset rock or enemy
        target.resetPosition()
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
        // update all joysticks
        (this.game as RuimteGruis).Arcade.Joysticks.forEach(j => j.update())

        this.bgtile.tilePositionX += 4

        // add enemies, rocks and bombs
        this.counter++
        if (this.counter % 350 == 0 && this.rockGroup.getChildren().length < 60) {
            this.rockGroup.add(new Rock(this), true)
        }

        if (this.counter % 430 == 0) {
            this.enemyGroup.add(new Enemy(this), true)
        }

        if(this.counter % 400 == 0) {
            this.enemyBulletGroup.add(new Bomb(this), true)
        }
    }
}