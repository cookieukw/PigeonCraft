import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';

export class SandTile extends Tile {
  constructor(id: number) {
    super(id);
    this.connectsToSand = true;
  }
  
  public override render(screen: Screen, level: Level, x: number, y: number): void {
    let col = Color.get(550, 550, 440, 440);
    let transitionColor = Color.get(440, 550, 440, 322);
    
    let u = level.getTile(x, y - 1) && !level.getTile(x, y - 1).connectsToSand;
    let d = level.getTile(x, y + 1) && !level.getTile(x, y + 1).connectsToSand;
    let l = level.getTile(x - 1, y) && !level.getTile(x - 1, y).connectsToSand;
    let r = level.getTile(x + 1, y) && !level.getTile(x + 1, y).connectsToSand;

    screen.render(x * 16 + 0, y * 16 + 0, (!u && !l) ? 0 : (l ? 11 : 12) + (u ? 0 : 1) * 32, (!u && !l) ? col : transitionColor, 0);
    screen.render(x * 16 + 8, y * 16 + 0, (!u && !r) ? 1 : (r ? 13 : 12) + (u ? 0 : 1) * 32, (!u && !r) ? col : transitionColor, 0);
    screen.render(x * 16 + 0, y * 16 + 8, (!d && !l) ? 2 : (l ? 11 : 12) + (d ? 2 : 1) * 32, (!d && !l) ? col : transitionColor, 0);
    screen.render(x * 16 + 8, y * 16 + 8, (!d && !r) ? 3 : (r ? 13 : 12) + (d ? 2 : 1) * 32, (!d && !r) ? col : transitionColor, 0);
  }

  public override getMapColor(): number { return Color.get(-1, 550, 550, 550); }
}
