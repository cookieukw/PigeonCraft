import { Mob } from '@/entity/Mob';
import { Color } from '@/engine/Color';
import { ItemEntity } from '@/entity/ItemEntity';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class Slime extends Mob {
  public jumpTime: number;

  constructor(lvl: number = 1) {
    super();
    this.lvl = lvl;
    this.maxHealth = lvl * lvl * 5;
    this.health = this.maxHealth;
    this.jumpTime = 0;
    this.xa = 0;
    this.ya = 0;
  }

  public override tick(input: Input): void {
    super.tick(input);
    
    if ((!this.move(this.xa, this.ya) || Math.random() < 0.05) && this.jumpTime <= -10) {
      this.xa = Math.floor(Math.random() * 3) - 1;
      this.ya = Math.floor(Math.random() * 3) - 1;
      
      if (this.level && (this.level as any).player) {
        const player = (this.level as any).player;
        let xd = player.x - this.x;
        let yd = player.y - this.y;
        if (xd * xd + yd * yd < 50 * 50) {
          this.xa = xd < 0 ? -1 : 1;
          this.ya = yd < 0 ? -1 : 1;
        }
      }
      
      if (this.xa !== 0 || this.ya !== 0) {
        this.jumpTime = 10;
      }
    }
    
    this.jumpTime--;
    if (this.jumpTime === 0) {
      this.xa = 0;
      this.ya = 0;
    }

    // Attack player on touch
    if (this.level && (this.level as any).player) {
        const player = (this.level as any).player;
        let xd = player.x - this.x;
        let yd = player.y - this.y;
        if (Math.abs(xd) < 8 && Math.abs(yd) < 8) {
            player.hurt(this, this.lvl, this.dir);
        }
    }
  }

  public override render(screen: Screen): void {
    let xt = 0;
    let xo = Math.floor(this.x - 8);
    let yo = Math.floor(this.y - 11);
    
    if (this.jumpTime > 0) {
      xt = 2;
      yo -= 4;
    }
    
    if (this.isSwimming()) {
        yo += 4;
        let swimCol = Color.get(-1, 115, 115, 115);
        if (this.level && (this.level as any).getTile(this.x >> 4, this.y >> 4).id === 13) swimCol = Color.get(-1, 520, 520, 520);
        screen.render(xo, yo + 3, 386, swimCol, 0);
        screen.render(xo + 8, yo + 3, 386, swimCol, 1);
    }
    
    let col = Color.get(-1, 10, 252, 555);
    if (this.lvl === 2) col = Color.get(-1, 100, 522, 555);
    
    if (this.hurtTime > 0) {
      col = Color.get(-1, 555, 555, 555);
    }

    const tileBase = 576;
    screen.render(xo + 0, yo, xt + tileBase, col, 0);
    screen.render(xo + 8, yo, xt + 1 + tileBase, col, 0);
    if (!this.isSwimming()) {
        screen.render(xo + 0, yo + 8, xt + 32 + tileBase, col, 0);
        screen.render(xo + 8, yo + 8, xt + 1 + 32 + tileBase, col, 0);
    }
  }

  public override die(): void {
    super.die();
    if (this.level) {
        this.level.add(new ItemEntity(new ResourceItem(Resources.slime), this.x, this.y));
    }
  }
}
