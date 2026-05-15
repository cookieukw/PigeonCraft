import { Furniture } from '@/entity/Furniture';
import { Color } from '@/engine/Color';
import { Inventory } from '@/item/Inventory';
import { ContainerMenu } from '@/screen/ContainerMenu';
import type { Player } from '@/entity/Player';

export class Chest extends Furniture {
  public inventory: Inventory;

  constructor() {
    super("Chest");
    this.col = Color.get(-1, 110, 331, 552);
    this.sprite = 1;
    this.inventory = new Inventory();
  }

  public override use(player: Player, _attackDir: number): boolean {
    (player as any).game.setMenu(new ContainerMenu(player, "CHEST", this.inventory));
    return true;
  }
}
