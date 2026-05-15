import { Item } from '@/item/Item';
import type { Resource } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Tile } from '@/level/tile/Tile';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';

export class ResourceItem extends Item {
  public resource: Resource;
  public count: number;

  constructor(resource: Resource, count: number = 1) {
    super();
    this.resource = resource;
    this.count = count;
    this.name = resource.name;
  }

  public override renderIcon(screen: Screen, x: number, y: number, overrideCol: number | null = null): void {
    screen.render(x, y, this.resource.sprite, overrideCol || this.resource.color, 0);
  }

  public override interactOn(tile: Tile, level: Level, xt: number, yt: number, player: Player, _attackDir: number): boolean {
    if (this.resource.interactOn) {
        if (this.resource.interactOn(tile, level, xt, yt, player)) {
            this.count--;
            return true;
        }
    }
    return false;
  }

  public override isDepleted(): boolean {
    return this.count <= 0;
  }
}
