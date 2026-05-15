import { Tile } from '@/level/tile/Tile';
import { ResourceItem } from '@/item/ResourceItem';
import { ItemEntity } from '@/entity/ItemEntity';
import type { Resource } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class OreTile extends Tile {
  public resource: Resource;

  constructor(id: number, resource: Resource) {
    super(id);
    this.resource = resource;
  }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    let col = this.resource.color;
    screen.render(x * 16 + 0, y * 16 + 0, 49, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, 50, col, 0);
    screen.render(x * 16 + 0, y * 16 + 8, 81, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, 82, col, 0);
  }

  public override mayPass(): boolean { return false; }

  public override hurt(level: Level, x: number, y: number, _source: Entity | null, dmg: number, _dir: number): void {
    let damage = level.data[x + y * level.w] + dmg;
    if (damage >= 40) {
      level.setTile(x, y, 5, 0); // Dirt
      for (let i = 0; i < Math.random() * 2 + 1; i++) {
        level.add(new ItemEntity(new ResourceItem(this.resource), x * 16 + 8, y * 16 + 8));
      }
    } else {
      level.data[x + y * level.w] = damage;
    }
  }

  public override interact(level: Level, xt: number, yt: number, player: Player, item: Item | null, dir: number): boolean {
    if (item && (item as any).type?.name === "Pickaxe" && player.payStamina(1)) {
      this.hurt(level, xt, yt, null, 1, dir);
      return true;
    }
    return false;
  }
}
