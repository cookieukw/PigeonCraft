import { Mob } from '@/entity/Mob';
import { Color } from '@/engine/Color';
import { ItemEntity } from '@/entity/ItemEntity';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';

export class Pigeon extends Mob {
  constructor() {
    super();
    this.x = Math.random() * 1024;
    this.y = Math.random() * 1024;
    this.xr = 4;
    this.yr = 4;
    this.randomWalkTime = 0;
    this.xa = 0;
    this.ya = 0;
  }

  public override tick(input: Input): void {
    super.tick(input);
    
    // Simple AI from Pigeon.java
    if (this.randomWalkTime > 0) {
      this.randomWalkTime--;
    } else {
      if (Math.random() < 0.05) {
        this.randomWalkTime = 60;
        this.xa = (Math.floor(Math.random() * 3) - 1);
        this.ya = (Math.floor(Math.random() * 3) - 1);
      } else {
        this.xa = 0;
        this.ya = 0;
      }
    }

    this.move(this.xa, this.ya);
  }

  public override render(screen: Screen): void {
    let xt = 0;
    let flip1 = (this.walkDist >> 3) & 1;
    let flip2 = (this.walkDist >> 3) & 1;
    
    if (this.dir === 1) xt = 2;
    if (this.dir > 1) {
      flip1 = 0;
      flip2 = (this.walkDist >> 4) & 1;
      if (this.dir === 2) flip1 = 1;
      xt += ((this.walkDist >> 3) & 1) * 2 + 4;
    }

    let xo = this.x - 8;
    let yo = this.y - 11;

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

    let col = Color.get(-1, 10, 252, 40); // Standard pigeon color

    if (this.hurtTime > 0) {
      col = Color.get(-1, 555, 555, 555);
    }

    // Pigeon tiles start at 448
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
        this.level.add(new ItemEntity(new ResourceItem(Resources.wheat), this.x, this.y));
    }
  }
}
