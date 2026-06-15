import { Tile } from '@/level/tile/Tile';
import { AirWizard } from '@/entity/AirWizard';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';

export class InfiniteFallTile extends Tile {
  constructor(id: number) {
    super(id);
  }

  public override render(_screen: Screen, _level: Level, _x: number, _y: number): void {
  }

  public override tick(_level: Level, _xt: number, _yt: number): void {
  }

  public override mayPass(_level: Level, _x: number, _y: number, e: Entity): boolean {
    if (e instanceof AirWizard) return true;
    return false;
  }
}
