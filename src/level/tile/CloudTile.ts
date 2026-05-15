import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';

export class CloudTile extends Tile {
  constructor(id: number) { super(id); }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    let col = Color.get(444, 444, 555, 555);
    screen.render(x * 16, y * 16, 0, col, 0);
    screen.render(x * 16 + 8, y * 16, 0, col, 0);
    screen.render(x * 16, y * 16 + 8, 0, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, 0, col, 0);
  }

  public override mayPass(_level: Level, _x: number, _y: number, _e: Entity | null): boolean { return true; }
}
