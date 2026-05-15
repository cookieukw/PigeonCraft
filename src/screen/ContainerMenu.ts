import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import type { Player } from '@/entity/Player';
import type { Inventory } from '@/item/Inventory';
import type { Input } from '@/engine/Input';
import type { Screen } from '@/engine/Screen';

export class ContainerMenu {
  public player: Player;
  public title: string;
  public inventory: Inventory;
  public selected: number;
  public window: number; // 0 = player inventory, 1 = container inventory
  public game: any;

  constructor(player: Player, title: string, inventory: Inventory) {
    this.player = player;
    this.title = title;
    this.inventory = inventory;
    this.selected = 0;
    this.window = 0;
  }

  public tick(input: Input): void {
    if (input.clicked('KeyE') || input.clicked('KeyX') || input.clicked('Escape')) {
      this.game.setMenu(null);
      return;
    }

    if (input.clicked('KeyA') || input.clicked('ArrowLeft')) {
        this.window = 0;
        this.selected = 0;
    }
    if (input.clicked('KeyD') || input.clicked('ArrowRight')) {
        this.window = 1;
        this.selected = 0;
    }

    if (input.clicked('KeyW') || input.clicked('ArrowUp')) this.selected--;
    if (input.clicked('KeyS') || input.clicked('ArrowDown')) this.selected++;

    const currentInventory = this.window === 0 ? this.player.inventory : this.inventory;
    const len = currentInventory.items.length;
    if (len > 0) {
      if (this.selected < 0) this.selected += len;
      if (this.selected >= len) this.selected -= len;
    } else {
        this.selected = 0;
    }

    if (input.clicked('Space') || input.clicked('Enter')) {
      const source = this.window === 0 ? this.player.inventory : this.inventory;
      const target = this.window === 0 ? this.inventory : this.player.inventory;
      
      if (source.items.length > 0) {
        const item = source.items.splice(this.selected, 1)[0];
        target.add(item);
        if (this.selected >= source.items.length) {
            this.selected = source.items.length - 1;
        }
        if (this.selected < 0) this.selected = 0;
      }
    }
  }

  public render(screen: Screen): void {
    if (this.window === 1) screen.setOffset(6 * 8, 0);
    Font.renderFrame(screen, this.window === 0 ? "INVENTORY" : this.title, 1, 1, 12, 11);
    this.renderInventory(screen, 1, 1, this.window === 0 ? this.player.inventory : this.inventory, this.window === 0);
    screen.setOffset(0, 0);
    
    // Always render both but highlighting the active one is tricky with frames
    // We'll just render them side by side manually
    
    // Render inactive window on the other side
    if (this.window === 0) {
        screen.setOffset(6 * 8, 0);
        Font.renderFrame(screen, this.title, 1, 1, 12, 11);
        this.renderInventory(screen, 1, 1, this.inventory, false);
        screen.setOffset(0, 0);
    } else {
        screen.setOffset(0, 0);
        Font.renderFrame(screen, "INVENTORY", 1, 1, 12, 11);
        this.renderInventory(screen, 1, 1, this.player.inventory, false);
    }
  }

  renderInventory(screen: Screen, x: number, y: number, inventory: Inventory, active: boolean): void {
    const items = inventory.items;
    for (let i = 0; i < 10; i++) {
        if (i >= items.length) break;
        const item = items[i];
        let col = Color.get(-1, 555, 555, 555);
        if (active && i === this.selected) {
            Font.draw(">", screen, (x + 1) * 8, (y + i + 1) * 8, col);
        }
        Font.draw(item.getName(), screen, (x + 2) * 8, (y + i + 1) * 8, col);
    }
  }
}
