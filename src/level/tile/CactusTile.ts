import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { SmashParticle } from '@/entity/particle/SmashParticle';
import { TextParticle } from '@/entity/particle/TextParticle';
import { ItemEntity } from '@/entity/ItemEntity';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';
import type { Mob } from '@/entity/Mob';

export class CactusTile extends Tile {
  constructor(id: number) {
    super(id);
    this.connectsToSand = true;
  }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    const col = Color.get(20, 40, 50, 440);
    screen.render(x * 16 + 0, y * 16 + 0, 8 + 2 * 32, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, 9 + 2 * 32, col, 0);
    screen.render(x * 16 + 0, y * 16 + 8, 8 + 3 * 32, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, 9 + 3 * 32, col, 0);
  }

  public override mayPass(_level: Level, _x: number, _y: number, _e: Entity): boolean {
    return false;
  }

  public hurt(level: Level, x: number, y: number, _source: Mob | null, dmg: number, _attackDir: number): void {
    const damage = level.data[x + y * level.w] + dmg;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(new TextParticle('' + dmg, x * 16 + 8, y * 16 + 8, Color.get(-1, 500, 500, 500)));
    
    if (damage >= 10) {
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++) {
        level.add(new ItemEntity(new ResourceItem(Resources.cactusFlower, 1), x * 16 + Math.floor(Math.random() * 10) + 3, y * 16 + Math.floor(Math.random() * 10) + 3));
      }
      level.setTile(x, y, 6, 0); // 6 is sand
    } else {
      level.data[x + y * level.w] = damage;
    }
  }

  public bumpedInto(_level: Level, _x: number, _y: number, entity: Entity): void {
    entity.hurt(null, 1, 0);
  }

  public tick(level: Level, xt: number, yt: number): void {
    const damage = level.data[xt + yt * level.w];
    if (damage > 0) level.data[xt + yt * level.w] = damage - 1;
  }
}
