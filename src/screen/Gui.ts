import { Color } from '@/engine/Color';
import { Font } from '@/engine/Font';
import type { Screen } from '@/engine/Screen';
import { Player } from '@/entity/Player';

export class Gui {
  public static render(screen: Screen, player: Player): void {
    // Health
    for (let i = 0; i < player.maxHealth; i++) {
      if (i < player.health) {
        screen.render((i * 8) + 3, 2, 384, Color.get(-1, 200, 500, 533), 0);
      } else {
        screen.render((i * 8) + 3, 2, 384, Color.get(-1, 100, 0, 0), 0);
      }
    }

    // Stamina
    for (let i = 0; i < player.maxStamina; i++) {
      if (i < player.stamina) {
        screen.render((i * 8) + 3, 10, 385, Color.get(-1, 220, 550, 553), 0);
      } else {
        screen.render((i * 8) + 3, 10, 385, Color.get(-1, 110, 0, 0), 0);
      }
    }

    // Active Item
    if (player.activeItem) {
        player.activeItem.renderIcon(screen, screen.w - 16, screen.h - 16);
    }

    // Level
    if (player.level) {
        Font.draw("Level: " + player.level.depth, screen, 3, screen.h - 12, Color.get(-1, 555, 555, 555));
    }
  }
}
