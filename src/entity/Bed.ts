import { Furniture } from '@/entity/Furniture';
import { Color } from '@/engine/Color';
import { Player } from '@/entity/Player';

export class Bed extends Furniture {
  constructor() {
    super("Bed");
    this.col = Color.get(-1, 100, 222, 555);
    this.sprite = 4; // Position in furniture spritesheet
    this.xr = 7;
    this.yr = 3;
  }

  public override use(player: Player, _attackDir: number): boolean {
    // Check if it's night
    if (player.lightlvl2 < 5) {
        player.game.save();
        // Skip to morning
        player.lightlvl2 = 12;
        player.rising = false;
        // Restore some health?
        player.health = player.maxHealth;
        console.log("Slept through the night. Game saved.");
        return true;
    } else {
        console.log("You can only sleep at night.");
        return false;
    }
  }
}
