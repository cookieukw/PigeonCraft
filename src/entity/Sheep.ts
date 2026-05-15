import { Mob } from '@/entity/Mob';
import { Color } from '@/engine/Color';
import { ItemEntity } from '@/entity/ItemEntity';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Entity } from '@/entity/Entity';
import type { Input } from '@/engine/Input';

export class Sheep extends Mob {
  public fleeTime: number;

  constructor(lvl: number = 1) {
    super();
    this.lvl = lvl;
    this.maxHealth = lvl * lvl * 10;
    this.health = this.maxHealth;
    this.fleeTime = 0;
    this.xa = 0;
    this.ya = 0;
    this.xr = 4;
    this.yr = 3;
  }

  public override tick(input: Input): void {
    super.tick(input);
    if (this.fleeTime > 0) {
      const speed = Math.floor(Math.random() * 2) + 1;
      if (this.fleeTime < 20 && Math.random() < 0.02) {
        this.xa *= Math.floor(Math.random() * 3) - 1;
        this.ya *= Math.floor(Math.random() * 3) - 1;
      }
      this.move(this.xa * speed, this.ya * speed);
      this.fleeTime--;
      return;
    }
    const speed2 = this.tickTime & 1;
    if (!this.move(this.xa * speed2, this.ya * speed2) || Math.random() < 0.01) {
      this.xa = (Math.floor(Math.random() * 3) - 1) * Math.floor(Math.random() * 2);
      this.ya = (Math.floor(Math.random() * 3) - 1) * Math.floor(Math.random() * 2);
    }
  }

  public override render(screen: Screen): void {
    let xt = 24;
    let flip1 = (this.walkDist >> 3) & 1;
    let flip2 = (this.walkDist >> 3) & 1;
    if (this.dir === 1) xt = 26;
    if (this.dir > 1) {
      flip1 = 0;
      flip2 = (this.walkDist >> 4) & 1;
      if (this.dir === 2) flip1 = 1;
      xt += ((this.walkDist >> 3) & 1) * 2 + 4;
    }
    const xo = Math.floor(this.x - 8);
    const yo = Math.floor(this.y - 11);
    let col = Color.get(-1, 10, 544, 444);
    if (this.hurtTime > 0) col = Color.get(-1, 555, 555, 555);

    if (this.isSwimming()) {
      const swimCol = Color.get(-1, -1, 115, 335);
      screen.render(xo + 0, yo + 8, 421, swimCol, 0);
      screen.render(xo + 8, yo + 8, 421, swimCol, 1);
    }

    screen.render(xo + (flip1 * 8), yo + 0, xt + 448, col, flip1);
    screen.render((xo + 8) - (flip1 * 8), yo + 0, xt + 1 + 448, col, flip1);
    if (!this.isSwimming()) {
      screen.render(xo + (flip2 * 8), yo + 8, xt + 480, col, flip2);
      screen.render((xo + 8) - (flip2 * 8), yo + 8, xt + 1 + 480, col, flip2);
    }
  }

  public override touchedBy(entity: Entity): void {
    this._flee(entity.x, entity.y);
  }

  public override hurt(source: Entity | null, damage: number, dir: number): void {
    super.hurt(source, damage, dir);
    if (source) this._flee(source.x, source.y);
  }

  private _flee(sx: number, sy: number): void {
    const dx = this.x - sx;
    const dy = this.y - sy;
    this.xa = 0;
    this.ya = 0;
    if (dx < 0) this.xa = -1;
    if (dx > 0) this.xa = 1;
    if (dy < 0) this.ya = -1;
    if (dy > 0) this.ya = 1;
    this.fleeTime = (Math.floor(Math.random() * 2) + 1) * 30;
  }

  public override die(): void {
    super.die();
    if (!this.level) return;
    const count = Math.floor(Math.random() * 2) + 1;
    for (let i = 0; i < count; i++) {
      this.level.add(new ItemEntity(new ResourceItem(Resources.wool),  this.x + Math.floor(Math.random() * 11) - 5, this.y + Math.floor(Math.random() * 11) - 5));
      this.level.add(new ItemEntity(new ResourceItem(Resources.bone),  this.x + Math.floor(Math.random() * 11) - 5, this.y + Math.floor(Math.random() * 11) - 5));
    }
    if ((this.level as any).player) (this.level as any).player.score += this.lvl * 20;
  }
}
