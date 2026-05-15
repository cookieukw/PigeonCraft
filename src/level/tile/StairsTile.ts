import { Tile } from '@/level/tile/Tile';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';
import type { Item } from '@/item/Item';

export class StairsTile extends Tile {
  public leadsUp: boolean;

  constructor(id: number, leadsUp: boolean) {
    super(id);
    this.leadsUp = leadsUp;
  }

  public override render(screen: Screen, _level: Level, x: number, y: number): void {
    let col = Color.get(333, 0, 333, 444);
    let xt = this.leadsUp ? 2 : 0;
    screen.render(x * 16, y * 16, xt + 64, col, 0);
    screen.render(x * 16 + 8, y * 16, xt + 1 + 64, col, 0);
    screen.render(x * 16, y * 16 + 8, xt + 96, col, 0);
    screen.render(x * 16 + 8, y * 16 + 8, xt + 1 + 96, col, 0);
  }

  public override interact(level: Level, _x: number, _y: number, _player: Player, _item: Item | null, _dir: number): boolean {
    level.changeLevel(this.leadsUp ? 1 : -1);
    return true;
  }
}
