import { Entity } from '@/entity/Entity';
import { TextParticle } from '@/entity/particle/TextParticle';
import { Color } from '@/engine/Color';
import { Sound } from '@/engine/Sound';
import type { Input } from '@/engine/Input';

export class Mob extends Entity {
  public dir: number = 0;
  public walkDist: number = 0;
  public tickTime: number = 0;
  public hurtTime: number = 0;
  public maxHealth: number = 10;
  public health: number = 10;
  public xKnockback: number = 0;
  public yKnockback: number = 0;
  public lvl: number = 1;
  public xa: number = 0;
  public ya: number = 0;
  public randomWalkTime: number = 0;

  constructor() {
    super();
    this.dir = 0;
    this.walkDist = 0;
    this.tickTime = 0;
    this.hurtTime = 0;
    this.maxHealth = 10;
    this.health = this.maxHealth;
    this.xKnockback = 0;
    this.yKnockback = 0;
  }

  public override tick(_input: Input): void {
    this.tickTime++;
    if (this.hurtTime > 0) this.hurtTime--;
    
    if (this.health <= 0) {
      this.die();
    }

    if (this.xKnockback !== 0 || this.yKnockback !== 0) {
      this.move(this.xKnockback, this.yKnockback);
      this.xKnockback *= 0.7;
      this.yKnockback *= 0.7;
      if (Math.abs(this.xKnockback) < 1) this.xKnockback = 0;
      if (Math.abs(this.yKnockback) < 1) this.yKnockback = 0;
    }
  }

  public isSwimming(): boolean {
    if (!this.level) return false;
    const tile = this.level.getTile(this.x >> 4, this.y >> 4);
    return !!(tile && (tile.id === 2 || tile.id === 13));
  }

  public override move(xa: number, ya: number): boolean {
    if (this.isSwimming()) {
        xa *= 0.5;
        ya *= 0.5;
    }
    if (xa !== 0 || ya !== 0) {
      this.walkDist++;
      if (ya > 0) this.dir = 0;
      if (ya < 0) this.dir = 1;
      if (xa < 0) this.dir = 2;
      if (xa > 0) this.dir = 3;
    }
    return super.move(xa, ya);
  }

  public hurt(source: Entity | null, damage: number, dir: number): void {
    if (this.hurtTime > 0) return;
    
    if (this.level) {
        this.level.add(new TextParticle("" + damage, this.x, this.y, Color.get(-1, 500, 0, 0)));
    }

    if (this.constructor.name === "Player") {
        Sound.play('playerHit');
        // @ts-ignore
        if (this.game) this.game.shake(8);
    } else {
        Sound.play('monsterHit');
    }

    this.health -= damage;
    if (source && source instanceof Mob && this.health <= 0) {
        // @ts-ignore
        if (typeof source.score === 'number') source.score += (this.lvl || 1) * 10;
    }

    if (dir === 0) this.yKnockback = 6;
    if (dir === 1) this.yKnockback = -6;
    if (dir === 2) this.xKnockback = -6;
    if (dir === 3) this.xKnockback = 6;
    
    this.hurtTime = (this.constructor.name === "Player") ? 30 : 10;
  }

  public die(): void {
    this.remove();
  }
}
