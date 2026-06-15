import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { SmashParticle } from '@/entity/particle/SmashParticle';
import { TextParticle } from '@/entity/particle/TextParticle';
import { ToolItem, ToolType } from '@/item/ToolItem';
import { AirWizard } from '@/entity/AirWizard';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class CloudCactusTile extends Tile {
  constructor(id: number) {
    super(id);
  }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    let col = Color.get(444, 444, 111, 555);
    screen.render(x * 16 + 0, y * 16 + 0, 8 + 32, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, 9 + 32, col, 0);
    screen.render(x * 16 + 0, y * 16 + 8, 8 + 4 * 32, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, 9 + 4 * 32, col, 0);
  }

  public override mayPass(_level: Level, _x: number, _y: number, e: Entity): boolean {
    if (e instanceof AirWizard) return true;
    return false;
  }

  public override interact(level: Level, xt: number, yt: number, player: Player, item: Item | null, _attackDir: number): boolean {
    if (item && item instanceof ToolItem) {
      if (item.type === ToolType.pickaxe) {
        if (player.payStamina(6 - item.level)) {
          this.hurt(level, xt, yt, null, 1, _attackDir);
          return true;
        }
      }
    }
    return false;
  }

  public override hurt(level: Level, x: number, y: number, _source: Entity | null, dmg: number, _dir: number): void {
    if (dmg <= 0) return;
    const damage = level.data[x + y * level.w] + 1;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(new TextParticle("" + dmg, x * 16 + 8, y * 16 + 8, Color.get(-1, 500, 500, 500)));
    
    if (damage >= 10) {
      level.setTile(x, y, 16, 0); // Back to cloud (16)
    } else {
      level.data[x + y * level.w] = damage;
    }
  }

  public bumpedInto(_level: Level, _x: number, _y: number, entity: Entity): void {
    if (entity instanceof AirWizard) return;
    entity.hurt(null, 3, 0);
  }
}
