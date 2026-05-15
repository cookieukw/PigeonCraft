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

export class RockTile extends Tile {
  constructor(id: number) { super(id); }

  public override render(screen: Screen, level: Level, x: number, y: number): void {
    let col = Color.get(444, 444, 333, 333);
    let transitionColor = Color.get(111, 444, 555, 322);

    let u = level.getTile(x, y - 1) !== this;
    let d = level.getTile(x, y + 1) !== this;
    let l = level.getTile(x - 1, y) !== this;
    let r = level.getTile(x + 1, y) !== this;
    let ul = level.getTile(x - 1, y - 1) !== this;
    let dl = level.getTile(x - 1, y + 1) !== this;
    let ur = level.getTile(x + 1, y - 1) !== this;
    let dr = level.getTile(x + 1, y + 1) !== this;

    if (!u && !l) {
      if (!ul) screen.render(x * 16 + 0, y * 16 + 0, 0, col, 0);
      else screen.render(x * 16 + 0, y * 16 + 0, 7, transitionColor, 3);
    } else {
      screen.render(x * 16 + 0, y * 16 + 0, (l ? 6 : 5) + (u ? 2 : 1) * 32, transitionColor, 3);
    }

    if (!u && !r) {
      if (!ur) screen.render(x * 16 + 8, y * 16 + 0, 1, col, 0);
      else screen.render(x * 16 + 8, y * 16 + 0, 8, transitionColor, 3);
    } else {
      screen.render(x * 16 + 8, y * 16 + 0, (r ? 4 : 5) + (u ? 2 : 1) * 32, transitionColor, 3);
    }

    if (!d && !l) {
      if (!dl) screen.render(x * 16 + 0, y * 16 + 8, 2, col, 0);
      else screen.render(x * 16 + 0, y * 16 + 8, 39, transitionColor, 3);
    } else {
      screen.render(x * 16 + 0, y * 16 + 8, (l ? 6 : 5) + (d ? 0 : 1) * 32, transitionColor, 3);
    }

    if (!d && !r) {
      if (!dr) screen.render(x * 16 + 8, y * 16 + 8, 3, col, 0);
      else screen.render(x * 16 + 8, y * 16 + 8, 40, transitionColor, 3);
    } else {
      screen.render(x * 16 + 8, y * 16 + 8, (r ? 4 : 5) + (d ? 0 : 1) * 32, transitionColor, 3);
    }
  }

  public override mayPass(): boolean { return false; }

  public override hurt(level: Level, x: number, y: number, _source: Entity | null, dmg: number, _dir: number): void {
    const damage = level.data[x + y * level.w] + dmg;
    level.add(new SmashParticle(x * 16 + 8, y * 16 + 8));
    level.add(new TextParticle("" + dmg, x * 16 + 8, y * 16 + 8, Color.get(-1, 500, 500, 500)));
    if (damage >= 50) {
      level.setTile(x, y, 5, 0); // Dirt
      for (let i = 0; i < Math.random() * 3 + 1; i++) {
        level.add(new ItemEntity(new ResourceItem(Resources.stone), x * 16 + 8, y * 16 + 8));
      }
    } else {
      level.data[x + y * level.w] = damage;
    }
  }

  public override interact(level: Level, xt: number, yt: number, player: Player, item: Item | null, dir: number): boolean {
    if (item && (item as any).type?.name === "Pickaxe" && player.payStamina(1)) {
      this.hurt(level, xt, yt, null, Math.floor(Math.random() * 10) + (item as any).level * 5 + 10, dir);
      return true;
    }
    return false;
  }
}
