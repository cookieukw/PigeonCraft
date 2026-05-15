import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { Resources } from '@/item/resource/Resource';
import { ResourceItem } from '@/item/ResourceItem';
import { ItemEntity } from '@/entity/ItemEntity';
import { SmashParticle } from '@/entity/particle/SmashParticle';
import { TextParticle } from '@/entity/particle/TextParticle';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class TreeTile extends Tile {
  constructor(id: number) {
    super(id);
    this.connectsToGrass = true;
  }

  public override render(screen: Screen, level: Level, x: number, y: number): void {
    let col = Color.get(10, 30, 151, 141);
    let barkCol1 = Color.get(10, 30, 430, 141);
    let barkCol2 = Color.get(10, 30, 320, 141);
    
    let u = level.getTile(x, y - 1) === this;
    let l = level.getTile(x - 1, y) === this;
    let r = level.getTile(x + 1, y) === this;
    let d = level.getTile(x, y + 1) === this;
    let ul = level.getTile(x - 1, y - 1) === this;
    let ur = level.getTile(x + 1, y - 1) === this;
    let dl = level.getTile(x - 1, y + 1) === this;
    let dr = level.getTile(x + 1, y + 1) === this;

    screen.render(x * 16 + 0, y * 16 + 0, (u && ul && l) ? 42 : 9, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, (u && ur && r) ? 74 : 10, (u && ur && r) ? barkCol2 : col, 0);
    screen.render(x * 16 + 0, y * 16 + 8, (d && dl && l) ? 74 : 41, (d && dl && l) ? barkCol2 : barkCol1, 0);
    screen.render(x * 16 + 8, y * 16 + 8, (d && dr && r) ? 42 : 106, (d && dr && r) ? col : barkCol2, 0);
  }

  public override getMapColor(): number { return Color.get(-1, 30, 30, 30); }

  public override mayPass(): boolean { return false; }

  public override hurt(level: Level, x: number, y: number, _source: Entity | null, dmg: number, _dir: number): void {
    const damage = level.data[x + y * level.w] + dmg;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(new TextParticle("" + dmg, x * 16 + 8, y * 16 + 8, Color.get(-1, 500, 500, 500)));
    if (damage >= 20) {
      level.setTile(x, y, 0, 0); // Grass
      for (let i = 0; i < Math.random() * 2 + 1; i++) {
        level.add(new ItemEntity(new ResourceItem(Resources.wood), x * 16 + 8, y * 16 + 8));
      }
    } else {
      level.data[x + y * level.w] = damage;
    }
  }

  public override interact(level: Level, xt: number, yt: number, player: Player, item: Item | null, dir: number): boolean {
    if (item && (item as any).type?.name === "Axe" && player.payStamina(1)) {
      this.hurt(level, xt, yt, null, Math.floor(Math.random() * 10) + (item as any).level * 5 + 10, dir);
      return true;
    }
    return false;
  }
}
