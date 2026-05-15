import { GrassTile } from '@/level/tile/GrassTile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';

export class FlowerTile extends GrassTile {
  public override render(screen: Screen, level: Level, x: number, y: number): void {
    super.render(screen, level, x, y);
    let shape = (x + y) % 2;
    let flowerCol = Color.get(10, 141, 555, 440);
    if (shape === 0) screen.render(x * 16 + 0, y * 16 + 0, 1 + 1 * 32, flowerCol, 0);
    if (shape === 1) screen.render(x * 16 + 8, y * 16 + 0, 1 + 1 * 32, flowerCol, 0);
  }
}
