import { Furniture } from '@/entity/Furniture';
import { Color } from '@/engine/Color';
import { CraftingMenu } from '@/screen/CraftingMenu';
import { Crafting } from '@/item/Crafting';
import { Player } from '@/entity/Player';

export class Anvil extends Furniture {
  constructor() {
    super("Anvil");
    this.col = Color.get(-1, 0, 111, 222);
    this.sprite = 0; // Keeping user's index for now
  }

  use(player: Player) {
    player.game.setMenu(new CraftingMenu(Crafting.anvil, player));
    return true;
  }
}
