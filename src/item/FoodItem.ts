import { Item } from '@/item/Item';
import type { Resource } from '@/item/resource/Resource';
import type { Screen } from '@/engine/Screen';
import type { Tile } from '@/level/tile/Tile';
import type { Level } from '@/level/Level';
import type { Player } from '@/entity/Player';

export class FoodItem extends Item {
  public resource: Resource;
  public heal: number;
  public count: number;

  constructor(resource: Resource, heal: number) {
    super();
    this.resource = resource;
    this.heal = heal;
    this.name = resource.name;
    this.count = 1;
  }

  public override renderIcon(screen: Screen, x: number, y: number, overrideCol: number | null = null): void {
    screen.render(x, y, this.resource.sprite, overrideCol || this.resource.color, 0);
  }

  public override interactOn(_tile: Tile, _level: Level, _xt: number, _yt: number, player: Player): boolean {
    if (player.health < player.maxHealth && player.payStamina(1)) {
      player.health += this.heal;
      if (player.health > player.maxHealth) player.health = player.maxHealth;
      this.count--;
      return true;
    }
    return false;
  }

  public override isDepleted(): boolean {
    return this.count <= 0;
  }
}
