export class Bullet extends Phaser.Physics.Arcade.Sprite {

    private particles:Phaser.GameObjects.Particles.ParticleEmitterManager

    constructor(scene: Phaser.Scene, x:number, y:number, direction:number = 1) {
        super(scene, x, y, "bullet")       
        
        this.addParticles()
        this.setScale(0.6) 

        this.scene.physics.add.existing(this) 
        this.setSize(this.displayWidth + 20, this.displayHeight + 20)

        this.setVelocity(100 * direction,0)
        this.setAccelerationX(400) 
        this.on('destroy', this.onBeforeDestroy)
    }

    private onBeforeDestroy() {
        this.particles.destroy();
    }

    // particles added to scene instead of bullet. use container to group particles and bullet
    private addParticles() {
        this.particles = this.scene.add.particles('pixel')

        let emitter = this.particles.createEmitter({
            lifespan: 200,
            speed: -100,
            tint: 0xFFFFFF,
            maxParticles: 25,
            scale: { start: 1, end: 0 },
            blendMode: 0
        });

        emitter.startFollow(this)
    }

    public update(): void {
        if (this.x > 1000) {
            this.destroy()
        }
    }

}
