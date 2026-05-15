import { Font } from '@/engine/Font';
import { Color } from '@/engine/Color';
import { Sound } from '@/engine/Sound';
import type { Screen } from '@/engine/Screen';
import type { Input } from '@/engine/Input';
import type { Player } from '@/entity/Player';
import type { Recipe } from '@/item/Recipe';

export class CraftingMenu {
  public recipes: Recipe[];
  public player: Player;
  public selected: number;
  public game: any;

  constructor(recipes: Recipe[], player: Player) {
    this.recipes = recipes;
    this.player = player;
    this.selected = 0;
  }

  public tick(input: Input): void {
    if (input.clicked('KeyE') || input.clicked('KeyX') || input.clicked('Escape')) {
      this.game.setMenu(null);
      return;
    }

    if (input.clicked('KeyW') || input.clicked('ArrowUp')) this.selected--;
    if (input.clicked('KeyS') || input.clicked('ArrowDown')) this.selected++;

    const len = this.recipes.length;
    if (len > 0) {
      if (this.selected < 0) this.selected += len;
      if (this.selected >= len) this.selected -= len;
    }

    if (input.clicked('Space') || input.clicked('Enter')) {
      if (len > 0) {
        const r = this.recipes[this.selected];
        if (r.checkCanCraft(this.player.inventory)) {
          Sound.play('craft');
          r.craft(this.player.inventory);
        }
      }
    }
  }

  public render(screen: Screen): void {
    Font.renderFrame(screen, "HAVE", 13, 1, 19, 3);
    Font.renderFrame(screen, "COST", 13, 4, 19, 11);
    Font.renderFrame(screen, "CRAFTING", 0, 1, 12, 11);

    const x0 = 0;
    const y0 = 1;

    for (let i = 0; i < 10; i++) {
        const rIdx = i;
        if (rIdx >= this.recipes.length) break;
        const r = this.recipes[rIdx];
        let col = r.checkCanCraft(this.player.inventory) ? Color.get(-1, 555, 555, 555) : Color.get(-1, 222, 222, 222);
        if (rIdx === this.selected) {
            Font.draw(">", screen, (x0 + 1) * 8, (y0 + i + 1) * 8, Color.get(-1, 555, 555, 555));
        }
        
        let name = r.resultItem.getName();
        // Truncate to avoid overflow if needed
        if (name.length > 8) name = name.substring(0, 8);

        r.resultItem.renderIcon(screen, (x0 + 2) * 8, (y0 + i + 1) * 8);
        Font.draw(name, screen, (x0 + 3) * 8, (y0 + i + 1) * 8, col);
    }

    if (this.recipes.length > 0) {
      const recipe = this.recipes[this.selected];
      
      // Render result icon
      recipe.resultItem.renderIcon(screen, 14 * 8, 2 * 8);
      
      for (let i = 0; i < recipe.costs.length; i++) {
        const cost = recipe.costs[i];
        const yo = (i + 5) * 8;
        const has = (this.player.inventory as any).findResource(cost.resource)?.count || 0;
        
        let col = has >= cost.count ? Color.get(-1, 555, 555, 555) : Color.get(-1, 222, 222, 222);
        
        // Render cost icon
        screen.render(14 * 8, yo, cost.resource.sprite, cost.resource.color, 0);
        Font.draw(cost.count + "/" + has, screen, 15 * 8, yo, col);
      }
    }
  }
}
