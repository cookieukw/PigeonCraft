import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';
import type { Player } from '@/entity/Player';

export class InventoryMenu {
  public player: Player;
  public selected: number;
  public game: any;

  constructor(player: Player) {
    this.player = player;
    this.selected = 0;
    if (player.activeItem) {
      player.inventory.add(player.activeItem);
      player.activeItem = null;
    }
  }

  public tick(input: Input): void {
    if (input.clicked('KeyE') || input.clicked('KeyM') || input.clicked('KeyX') || input.clicked('Escape')) {
      this.game.setMenu(null);
      return;
    }

    if (input.clicked('KeyW') || input.clicked('ArrowUp')) this.selected--;
    if (input.clicked('KeyS') || input.clicked('ArrowDown')) this.selected++;

    const len = this.player.inventory.items.length;
    if (len > 0) {
      if (this.selected < 0) this.selected += len;
      if (this.selected >= len) this.selected -= len;
    }

    if (input.clicked('Space') || input.clicked('Enter')) {
      if (len > 0) {
        this.player.activeItem = this.player.inventory.items.splice(this.selected, 1)[0];
        this.game.setMenu(null);
      }
    }
  }

  public render(screen: Screen): void {
    Font.renderFrame(screen, "INVENTORY", 1, 1, 12, 11);
    
    const x0 = 1;
    const y0 = 1;
    const items = this.player.inventory.items;

    for (let i = 0; i < 10; i++) {
        if (i >= items.length) break;
        const item = items[i];
        if (i === this.selected) {
            Font.draw(">", screen, (x0 + 1) * 8, (y0 + i + 1) * 8, Color.get(-1, 555, 555, 555));
        }
        Font.draw(item.getName(), screen, (x0 + 2) * 8, (y0 + i + 1) * 8, Color.get(-1, 555, 555, 555));
    }
  }
}
