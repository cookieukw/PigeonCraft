import { Furniture } from '@/entity/Furniture';
import { Color } from '@/engine/Color';
import { CraftingMenu } from '@/screen/CraftingMenu';
import { Crafting } from '@/item/Crafting';
import { Player } from '@/entity/Player';

export class Furnace extends Furniture {
  constructor() {
    super("Furnace");
    this.col = Color.get(-1, 0, 222, 333);
    this.sprite = 3;
  }

  public override use(player: Player, _attackDir: number): boolean {
    player.game.setMenu(new CraftingMenu(Crafting.furnace, player));
    return true;
  }
}
