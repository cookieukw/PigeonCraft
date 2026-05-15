import { Furniture } from '@/entity/Furniture';
import { Color } from '@/engine/Color';
import { CraftingMenu } from '@/screen/CraftingMenu';
import { Crafting } from '@/item/Crafting';
import type { Player } from '@/entity/Player';

export class Oven extends Furniture {
  constructor() {
    super("Oven");
    this.col = Color.get(-1, 0, 332, 442);
    this.sprite = 2;
  }

  public override use(player: Player, _attackDir: number): boolean {
    player.game.setMenu(new CraftingMenu(Crafting.oven, player));
    return true;
  }
}
