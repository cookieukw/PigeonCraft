import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { SmashParticle } from '@/entity/particle/SmashParticle';
import { TextParticle } from '@/entity/particle/TextParticle';
import { ItemEntity } from '@/entity/ItemEntity';
import { ResourceItem } from '@/item/ResourceItem';
import { Resources } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class WoodPlankTile extends Tile {
  constructor(id: number) { super(id); }

  public override render(screen: Screen, level: Level, x: number, y: number): void {
    const color = Color.get(level.dirtColor || 210, 430, 420, 320);
    screen.render(x * 16 + 0, y * 16 + 0, 53, color, 0);
    screen.render(x * 16 + 8, y * 16 + 0, 54, color, 0);
    screen.render(x * 16 + 0, y * 16 + 8, 85, color, 0);
    screen.render(x * 16 + 8, y * 16 + 8, 86, color, 0);
  }

  public override interact(level: Level, xt: number, yt: number, player: Player, item: Item | null, _dir: number): boolean {
    if (item && (item as any).type?.name === 'Axe' && player.payStamina(Math.max(1, 4 - (item as any).level))) {
      this._hurt(level, xt, yt, Math.floor(Math.random() * 10) + (item as any).level * 5 + 10);
      return true;
    }
    return false;
  }

  private _hurt(level: Level, x: number, y: number, dmg: number): void {
    const damage = level.data[x + y * level.w] + dmg;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(new TextParticle('' + dmg, x * 16 + 8, y * 16 + 8, Color.get(-1, 500, 500, 500)));
    if (damage >= 20) {
      const count = Math.floor(Math.random() * 2) + 1;
      for (let i = 0; i < count; i++)
        level.add(new ItemEntity(new ResourceItem(Resources.wood), x * 16 + Math.floor(Math.random() * 10) + 3, y * 16 + Math.floor(Math.random() * 10) + 3));
      level.setTile(x, y, 5, 0); // dirt
    } else {
      level.data[x + y * level.w] = damage;
    }
  }
}
