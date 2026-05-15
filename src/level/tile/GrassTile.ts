import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import { Resources } from '@/item/resource/Resource';
import { ResourceItem } from '@/item/ResourceItem';
import { ItemEntity } from '@/entity/ItemEntity';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Entity } from '@/entity/Entity';

export class GrassTile extends Tile {
  constructor(id: number) {
    super(id);
    this.connectsToGrass = true;
  }
  
  public override render(screen: Screen, level: Level, x: number, y: number): void {
    let col = Color.get(141, 141, 252, 252);
    let transitionColor = Color.get(30, 141, 252, 322);

    let u = level.getTile(x, y - 1) && !level.getTile(x, y - 1).connectsToGrass;
    let d = level.getTile(x, y + 1) && !level.getTile(x, y + 1).connectsToGrass;
    let l = level.getTile(x - 1, y) && !level.getTile(x - 1, y).connectsToGrass;
    let r = level.getTile(x + 1, y) && !level.getTile(x + 1, y).connectsToGrass;

    screen.render(x * 16 + 0, y * 16 + 0, (!u && !l) ? 0 : (l ? 11 : 12) + (u ? 0 : 1) * 32, (!u && !l) ? col : transitionColor, 0);
    screen.render(x * 16 + 8, y * 16 + 0, (!u && !r) ? 1 : (r ? 13 : 12) + (u ? 0 : 1) * 32, (!u && !r) ? col : transitionColor, 0);
    screen.render(x * 16 + 0, y * 16 + 8, (!d && !l) ? 2 : (l ? 11 : 12) + (d ? 2 : 1) * 32, (!d && !l) ? col : transitionColor, 0);
    screen.render(x * 16 + 8, y * 16 + 8, (!d && !r) ? 3 : (r ? 13 : 12) + (d ? 2 : 1) * 32, (!d && !r) ? col : transitionColor, 0);
  }

  public override getMapColor(): number { return Color.get(-1, 141, 141, 141); }

  public override hurt(level: Level, x: number, y: number, _source: Entity | null, _dmg: number, _dir: number): void {
    if (Math.random() < 0.05) {
      level.add(new ItemEntity(new ResourceItem(Resources.seeds), x * 16 + 8, y * 16 + 8));
    }
  }
}
