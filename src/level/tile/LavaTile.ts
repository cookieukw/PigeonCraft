import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';

export class LavaTile extends Tile {
  constructor(id: number) {
    super(id);
    this.connectsToSand = true;
    this.connectsToLava = true;
  }

  public override render(screen: Screen, level: Level, x: number, y: number): void {
    let col = Color.get(500, 500, 520, 550);
    let transitionColor1 = Color.get(500, 500, 211, 322);
    let transitionColor2 = Color.get(500, 500, 440, 550);
    
    let u = level.getTile(x, y - 1) && !level.getTile(x, y - 1).connectsToLava;
    let d = level.getTile(x, y + 1) && !level.getTile(x, y + 1).connectsToLava;
    let l = level.getTile(x - 1, y) && !level.getTile(x - 1, y).connectsToLava;
    let r = level.getTile(x + 1, y) && !level.getTile(x + 1, y).connectsToLava;
    
    let su = u && level.getTile(x, y - 1) && level.getTile(x, y - 1).connectsToSand;
    let sd = d && level.getTile(x, y + 1) && level.getTile(x, y + 1).connectsToSand;
    let sl = l && level.getTile(x - 1, y) && level.getTile(x - 1, y).connectsToSand;
    let sr = r && level.getTile(x + 1, y) && level.getTile(x + 1, y).connectsToSand;

    let tCol1 = (su || sl) ? transitionColor2 : transitionColor1;
    let tCol2 = (su || sr) ? transitionColor2 : transitionColor1;
    let tCol3 = (sd || sl) ? transitionColor2 : transitionColor1;
    let tCol4 = (sd || sr) ? transitionColor2 : transitionColor1;

    screen.render(x * 16 + 0, y * 16 + 0, (!u && !l) ? 0 : (l ? 14 : 15) + (u ? 0 : 1) * 32, (!u && !l) ? col : tCol1, 0);
    screen.render(x * 16 + 8, y * 16 + 0, (!u && !r) ? 1 : (r ? 16 : 15) + (u ? 0 : 1) * 32, (!u && !r) ? col : tCol2, 0);
    screen.render(x * 16 + 0, y * 16 + 8, (!d && !l) ? 2 : (l ? 14 : 15) + (d ? 2 : 1) * 32, (!d && !l) ? col : tCol3, 0);
    screen.render(x * 16 + 8, y * 16 + 8, (!d && !r) ? 3 : (r ? 16 : 15) + (d ? 2 : 1) * 32, (!d && !r) ? col : tCol4, 0);
  }

  public override getMapColor(): number { return Color.get(-1, 500, 500, 500); }

  public override mayPass(_level: Level, _x: number, _y: number, entity: Entity | { canSwim?(): boolean } | null): boolean {
    return !!(entity && entity.canSwim && entity.canSwim());
  }
}

