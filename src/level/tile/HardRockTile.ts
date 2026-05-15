import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { SmashParticle } from '@/entity/particle/SmashParticle';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class HardRockTile extends Tile {
  constructor(id: number) {
    super(id);
  }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    let col = Color.get(111, 111, 222, 333);
    screen.render(x * 16 + 0, y * 16 + 0, 4, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, 4, col, 1);
    screen.render(x * 16 + 0, y * 16 + 8, 4, col, 2);
    screen.render(x * 16 + 8, y * 16 + 8, 4, col, 3);
  }

  public override mayPass(): boolean { return false; }

  public override getMapColor(): number { return Color.get(-1, 111, 111, 111); }

  public override hurt(level: Level, x: number, y: number, _source: Entity | null, dmg: number, _dir: number): void {
    const damage = level.data[x + y * level.w] + dmg;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    if (damage >= 200) {
      level.setTile(x, y, 5, 0); // Dirt
    } else {
      level.data[x + y * level.w] = damage;
    }
  }

  public override interact(level: Level, xt: number, yt: number, player: Player, item: Item | null, dir: number): boolean {
    if (item && (item as any).type?.name === "Pickaxe" && (item as any).level >= 2 && player.payStamina(1)) {
      this.hurt(level, xt, yt, null, Math.floor(Math.random() * 10) + (item as any).level * 5 + 10, dir);
      return true;
    }
    return false;
  }
}
