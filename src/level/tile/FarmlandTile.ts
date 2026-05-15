import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';

export class FarmlandTile extends Tile {
  constructor(id: number) {
    super(id);
  }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    let col = Color.get(210, 210, 100, 100);
    screen.render(x * 16 + 0, y * 16 + 0, 2 + 32, col, 0);
    screen.render(x * 16 + 8, y * 16 + 0, 3 + 32, col, 0);
    screen.render(x * 16 + 0, y * 16 + 8, 2 + 32, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, 3 + 32, col, 0);
  }

  public override getMapColor(): number { return Color.get(-1, 210, 210, 210); }

  public override tick(_level: Level, _xt: number, _yt: number): void {
    // Dried up farmland? Not for now.
  }
}
