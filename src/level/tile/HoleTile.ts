import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';

export class HoleTile extends Tile {
  constructor(id: number) {
    super(id);
    this.connectsToSand = true;
    this.connectsToWater = true;
  }

  public override render(screen: Screen, level: Level, x: number, y: number): void {
    const col  = Color.get(111, 111, 110, 110);
    const tCol = Color.get(3, 111, 100, 211); // dark hole transition

    const u = level.getTile(x, y - 1) && !level.getTile(x, y - 1).connectsToWater;
    const d = level.getTile(x, y + 1) && !level.getTile(x, y + 1).connectsToWater;
    const l = level.getTile(x - 1, y) && !level.getTile(x - 1, y).connectsToWater;
    const r = level.getTile(x + 1, y) && !level.getTile(x + 1, y).connectsToWater;

    screen.render(x * 16 + 0, y * 16 + 0, (!u && !l) ? 0 : (l ? 14 : 15) + (u ? 0 : 1) * 32, (!u && !l) ? col : tCol, 0);
    screen.render(x * 16 + 8, y * 16 + 0, (!u && !r) ? 1 : (r ? 16 : 15) + (u ? 0 : 1) * 32, (!u && !r) ? col : tCol, 0);
    screen.render(x * 16 + 0, y * 16 + 8, (!d && !l) ? 2 : (l ? 14 : 15) + (d ? 2 : 1) * 32, (!d && !l) ? col : tCol, 0);
    screen.render(x * 16 + 8, y * 16 + 8, (!d && !r) ? 3 : (r ? 16 : 15) + (d ? 2 : 1) * 32, (!d && !r) ? col : tCol, 0);
  }

  // Only entities that can swim can cross holes (they "fall in")
  public override mayPass(_level: Level, _x: number, _y: number, entity: Entity | { canSwim?(): boolean } | null): boolean {
    return !!(entity && entity.canSwim && entity.canSwim());
  }

  public override getMapColor(): number { return Color.get(-1, 111, 111, 111); }
}
