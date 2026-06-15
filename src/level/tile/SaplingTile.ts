import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Mob } from '@/entity/Mob';

export class SaplingTile extends Tile {
  private onType: Tile;
  private growsTo: Tile;

  constructor(id: number, onType: Tile, growsTo: Tile) {
    super(id);
    this.onType = onType;
    this.growsTo = growsTo;
    this.connectsToSand = onType.connectsToSand;
    this.connectsToGrass = onType.connectsToGrass;
    this.connectsToWater = onType.connectsToWater;
    this.connectsToLava = onType.connectsToLava;
  }

  public override render(screen: Screen, level: Level, x: number, y: number): void {
    this.onType.render(screen, level, x, y);
    const col = Color.get(10, 40, 50, -1);
    screen.render(x * 16 + 4, y * 16 + 4, 11 + 3 * 32, col, 0);
  }

  public override tick(level: Level, x: number, y: number): void {
    const age = level.data[x + y * level.w] + 1;
    if (age > 100) {
      level.setTile(x, y, this.growsTo.id, 0);
    } else {
      level.data[x + y * level.w] = age;
    }
  }

  public override hurt(level: Level, x: number, y: number, _source: Mob | null, _dmg: number, _attackDir: number): void {
    level.setTile(x, y, this.onType.id, 0);
  }
}
