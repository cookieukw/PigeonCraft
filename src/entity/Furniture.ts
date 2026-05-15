import { Entity } from '@/entity/Entity';
import { FurnitureItem } from '@/item/FurnitureItem';
import { ItemEntity } from '@/entity/ItemEntity';
import type { Screen } from '@/engine/Screen';
import { Player } from '@/entity/Player';

export class Furniture extends Entity {
  public name: string;
  public col: number = 0;
  public sprite: number = 0;

  constructor(name: string) {
    super();
    this.name = name;
    this.xr = 3;
    this.yr = 3;
    this.col = 0;
    this.sprite = 0;
  }

  public override render(screen: Screen): void {
    const tileBase = (this.sprite * 2) + 256;
    screen.render(this.x - 8, this.y - 12, tileBase, this.col, 0);
    screen.render(this.x + 0, this.y - 12, tileBase + 1, this.col, 0);
    screen.render(this.x - 8, this.y - 4, tileBase + 32, this.col, 0);
    screen.render(this.x + 0, this.y - 4, tileBase + 33, this.col, 0);
  }

  public take(player: Player): void {
    this.remove();
    player.inventory.add(new FurnitureItem(this));
  }

  public override hurt(_source: Entity | null, _damage: number, _dir: number): void {
    this.remove();
    if (this.level) {
        this.level.add(new ItemEntity(new FurnitureItem(this), this.x, this.y));
    }
  }
}
