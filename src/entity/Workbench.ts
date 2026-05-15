import { Furniture } from '@/entity/Furniture';
import { CraftingMenu } from '@/screen/CraftingMenu';
import { Crafting } from '@/item/Crafting';
import { Color } from '@/engine/Color';
import type { Player } from '@/entity/Player';

export class Workbench extends Furniture {
  constructor() {
    super("Workbench");
    this.col = Color.get(-1, 100, 321, 431);
    this.sprite = 0;
  }

  public override use(player: Player): boolean {
    player.game.setMenu(new CraftingMenu(Crafting.workbench, player));
    return true;
  }
}
