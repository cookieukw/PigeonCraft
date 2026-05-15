import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';

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

  public override mayPass(_level: Level, _x: number, _y: number, _e: Entity): boolean {
    return false;
  }

  public override hurt(level: Level, x: number, y: number, _source: Entity, _dmg: number, _dir: number): void {
    level.setTile(x, y, 16, 0); // Back to cloud
  }
}
