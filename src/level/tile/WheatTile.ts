import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { Resources } from '@/item/resource/Resource';
import { ResourceItem } from '@/item/ResourceItem';
import { ItemEntity } from '@/entity/ItemEntity';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';

export class WheatTile extends Tile {
  constructor(id: number) {
    super(id);
  }

  public override render(screen: Screen, level: Level, x: number, y: number): void {
    let age = level.data[x + y * level.w];
    let col = Color.get(-1, 110, 330, 550);
    let icon = 14 + (Math.floor(age / 10)) + 3 * 32;
    screen.render(x * 16 + 0, y * 16 + 0, icon, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, icon, col, 1);
    screen.render(x * 16 + 0, y * 16 + 8, icon + 32, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, icon + 32, col, 1);
  }

  public override tick(level: Level, x: number, y: number): void {
    let age = level.data[x + y * level.w];
    if (age < 50) level.data[x + y * level.w] = age + 1;
  }

  public override getMapColor(): number { return Color.get(-1, 110, 330, 550); }

  public override hurt(level: Level, x: number, y: number, _source: Entity | null, _dmg: number, _dir: number): void {
    let age = level.data[x + y * level.w];
    if (age >= 50) {
      for (let i = 0; i < Math.random() * 2 + 1; i++) {
        level.add(new ItemEntity(new ResourceItem(Resources.wheat), x * 16 + 8, y * 16 + 8));
      }
      for (let i = 0; i < Math.random() * 2; i++) {
        level.add(new ItemEntity(new ResourceItem(Resources.seeds), x * 16 + 8, y * 16 + 8));
      }
    }
    level.setTile(x, y, 5, 0); // Back to dirt
  }
}
