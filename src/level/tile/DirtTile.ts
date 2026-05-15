import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { Resources } from '@/item/resource/Resource';
import { ResourceItem } from '@/item/ResourceItem';
import { ItemEntity } from '@/entity/ItemEntity';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class DirtTile extends Tile {
  constructor(id: number) {
    super(id);
  }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    let col = Color.get(322, 322, 222, 222);
    screen.render(x * 16 + 0, y * 16 + 0, 0, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, 1, col, 0);
    screen.render(x * 16 + 0, y * 16 + 8, 2, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, 3, col, 0);
  }

  public override interact(level: Level, xt: number, yt: number, player: Player, item: Item | null, _dir: number): boolean {
    if (item && (item as any).type?.name === "Shovel" && player.payStamina(1)) {
      level.setTile(xt, yt, 0, 0); // Grass for now
      level.add(new ItemEntity(new ResourceItem(Resources.dirt), xt * 16 + 8, yt * 16 + 8));
      return true;
    }
    if (item && (item as any).type?.name === "Hoe" && player.payStamina(1)) {
      level.setTile(xt, yt, 11, 0); // Farmland
      return true;
    }
    return false;
  }

  public override getMapColor(): number { return Color.get(-1, 222, 222, 222); }
}
