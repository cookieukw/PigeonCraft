import { Mob } from '@/entity/Mob';
import { Color } from '@/engine/Color';
import { ItemEntity } from '@/entity/ItemEntity';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class Skeleton extends Mob {
  public lvl: number;
  public xa: number;
  public ya: number;
  public randomWalkTime: number;

  constructor(lvl: number = 1) {
    super();
    this.lvl = lvl;
    this.maxHealth = lvl * lvl * 10;
    this.health = this.maxHealth;
    this.randomWalkTime = 0;
    this.xa = 0;
    this.ya = 0;
  }

  public override tick(input: Input): void {
    super.tick(input);
    
    if (this.level && (this.level as any).player && this.randomWalkTime === 0) {
      const player = (this.level as any).player;
      let xd = player.x - this.x;
      let yd = player.y - this.y;
      if (xd * xd + yd * yd < 80 * 80) { // Skeletons notice player from further away
        this.xa = 0;
        this.ya = 0;
        if (xd < 0) this.xa = -1;
        if (xd > 0) this.xa = 1;
        if (yd < 0) this.ya = -1;
        if (yd > 0) this.ya = 1;
      }
    }

    let speed = (this.tickTime % 3 === 0) ? 0 : 1; // Slightly faster than zombie
    if (!this.move(this.xa * speed, this.ya * speed) || Math.random() < 0.02) {
      this.randomWalkTime = 60;
      this.xa = (Math.floor(Math.random() * 3) - 1);
      this.ya = (Math.floor(Math.random() * 3) - 1);
    }
    
    if (this.randomWalkTime > 0) this.randomWalkTime--;

    // Attack player on touch
    if (this.level && (this.level as any).player) {
        const player = (this.level as any).player;
        let xd = player.x - this.x;
        let yd = player.y - this.y;
        if (Math.abs(xd) < 8 && Math.abs(yd) < 8) {
            player.hurt(this, this.lvl + 1, this.dir);
        }
    }
  }

  public override render(screen: Screen): void {
    let xt = 12; // Skeleton sprite offset
    let flip1 = (this.walkDist >> 3) & 1;
    let flip2 = (this.walkDist >> 3) & 1;

    if (this.dir === 1) xt += 2;
    if (this.dir > 1) {
      flip1 = 0;
      flip2 = (this.walkDist >> 4) & 1;
      if (this.dir === 2) flip1 = 1;
      xt += ((this.walkDist >> 3) & 1) * 2 + 4;
    }

    let xo = Math.floor(this.x - 8);
    let yo = Math.floor(this.y - 11);
    
    if (this.isSwimming()) {
        let swimCol = Color.get(-1, 115, 115, 115);
        if (this.level && (this.level as any).getTile(this.x >> 4, this.y >> 4).id === 13) swimCol = Color.get(-1, 520, 520, 520);
        if (((this.tickTime / 8) & 1) === 0) {
            screen.render(xo + 0, yo + 8, 421, swimCol, 0);
            screen.render(xo + 8, yo + 8, 421, swimCol, 1);
        } else {
            screen.render(xo + 0, yo + 8, 421, swimCol, 1);
            screen.render(xo + 8, yo + 8, 421, swimCol, 0);
        }
        yo += 4;
    }
    
    let col = Color.get(-1, 555, 555, 555); // Skeleton white
    if (this.lvl === 2) col = Color.get(-1, 444, 444, 444); // Darker skeleton
    
    if (this.hurtTime > 0) {
      col = Color.get(-1, 555, 555, 555);
    }

    const tileBase = 448;
    screen.render(xo + flip1 * 8, yo, xt + tileBase, col, flip1);
    screen.render(xo + 8 - flip1 * 8, yo, xt + 1 + tileBase, col, flip1);
    
    if (!this.isSwimming()) {
        screen.render(xo + flip2 * 8, yo + 8, xt + 32 + tileBase, col, flip2);
        screen.render(xo + 8 - flip2 * 8, yo + 8, xt + 1 + 32 + tileBase, col, flip2);
    }
  }

  public override die(): void {
    super.die();
    if (this.level) {
        this.level.add(new ItemEntity(new ResourceItem(Resources.bone || Resources.wood), this.x, this.y));
    }
  }
}
